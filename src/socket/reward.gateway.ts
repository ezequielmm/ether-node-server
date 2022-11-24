import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { filter } from 'lodash';
import { Socket } from 'socket.io';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { CardService } from 'src/game/components/card/card.service';
import {
    ExpeditionMapNodeTypeEnum,
    IExpeditionNodeReward,
} from 'src/game/components/expedition/expedition.enum';
import { Reward } from 'src/game/components/expedition/expedition.interface';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { PotionService } from 'src/game/components/potion/potion.service';
import { TrinketService } from 'src/game/components/trinket/trinket.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class RewardGateway {
    private readonly logger: Logger = new Logger(RewardGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly potionService: PotionService,
        private readonly cardService: CardService,
        private readonly fullSyncAction: FullSyncAction,
        private readonly trinketService: TrinketService,
    ) {}

    @SubscribeMessage('RewardSelected')
    async handleRewardSelected(
        client: Socket,
        rewardId: string,
    ): Promise<string> {
        // Get the game context
        const ctx = await this.expeditionService.getGameContext(client);

        // Get the updated expedition
        const expedition = ctx.expedition;

        this.logger.debug(`Client ${client.id} choose reward id: ${rewardId}`);

        const {
            currentNode: { completed: nodeIsCompleted, nodeType },
        } = expedition;

        const expeditionId = expedition._id.toString();

        let rewards: Reward[] = [];

        if (nodeType === ExpeditionMapNodeTypeEnum.Treasure) {
            rewards = expedition.currentNode.treasureData.rewards;
        } else {
            rewards = expedition.currentNode.data.rewards;
        }

        if (nodeIsCompleted) {
            // Check if the node is completed
            this.logger.debug('Node already completed, cannot select reward');
            return '';
        }

        // check if the reward that we are receiving is correct and exists
        const reward = rewards.find(({ id }) => {
            return id === rewardId;
        });

        // If the reward is invalid we throw and exception
        if (!reward) throw new Error(`Reward ${rewardId} not found`);

        // Now we set that we took the reward
        reward.taken = true;

        // Now we apply the redward to the user profile
        switch (reward.type) {
            case IExpeditionNodeReward.Gold:
                await this.expeditionService.updateById(expeditionId, {
                    $inc: {
                        'playerState.gold': reward.amount,
                    },
                });
                break;
            case IExpeditionNodeReward.Potion:
                reward.taken = await this.potionService.add(
                    ctx,
                    reward.potion.potionId,
                );
                break;
            case IExpeditionNodeReward.Card:
                await this.cardService.addCardToDeck(ctx, reward.card.cardId);
                // Disable all other card rewards
                rewards = rewards.map((reward) => {
                    if (reward.type === IExpeditionNodeReward.Card) {
                        reward.taken = true;
                    }
                    return reward;
                });
                break;
            case IExpeditionNodeReward.Trinket:
                reward.taken = await this.trinketService.add(
                    ctx,
                    reward.trinket.trinketId,
                );
                break;
        }

        await this.fullSyncAction.handle(client, false);

        // Next we save the reward on the expedition
        if (nodeType === ExpeditionMapNodeTypeEnum.Treasure) {
            await this.expeditionService.updateById(expedition._id.toString(), {
                $set: {
                    'currentNode.treasureData.rewards': rewards,
                },
            });
        } else {
            await this.expeditionService.updateById(expedition._id.toString(), {
                $set: {
                    'currentNode.data.rewards': rewards,
                },
            });
        }

        // Now we get the rewards that are pending to be taken
        const pendingRewards = filter(rewards, {
            taken: false,
        });

        return StandardResponse.respond({
            message_type:
                nodeType === ExpeditionMapNodeTypeEnum.Treasure
                    ? SWARMessageType.EndTreasure
                    : SWARMessageType.EndCombat,
            action: SWARAction.SelectAnotherReward,
            data: {
                rewards: pendingRewards,
            },
        });
    }
}
