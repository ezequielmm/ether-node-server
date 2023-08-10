import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { RewardService } from 'src/game/reward/reward.service';
import { corsSocketSettings } from './socket.enum';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';
import { Logger } from '@nestjs/common';
import { NodeType } from 'src/game/components/expedition/node-type';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';

@WebSocketGateway(corsSocketSettings)
export class RewardGateway {
    private readonly logger: Logger = new Logger(RewardGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly fullSyncAction: FullSyncAction,
        private readonly rewardService: RewardService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('RewardSelected')
    async handleRewardSelected(
        client: Socket,
        rewardId: string,
    ): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client),
            async () => {
                this.logger.debug('<REWARD SELECTED>');
                try {
                    const ctx = await this.expeditionService.getGameContext(
                        client,
                    );

                    // Here we deestructure the expedition from the context
                    // to get the current node type and check if it's a node that can take rewards
                    const {
                        expedition: {
                            currentNode: { nodeType },
                        },
                    } = ctx;

                    // Now we create a list of node types that can take rewards
                    const rewardNodeTypes = [
                        NodeType.Combat,
                        NodeType.Treasure,
                    ];

                    // If the node type is not a reward node, we skip the reward selection
                    if (!rewardNodeTypes.includes(nodeType)) return;

                    // Now we take the remaining rewards and send them back to the client
                    await this.rewardService
                        .takeReward(ctx, rewardId)
                        .catch((error) => this.logger.error({error,}))
                        .then((rewards) => {
                            // Now we need to send the rewards to the client
                            ctx.client.emit(
                                'RewardList',
                                StandardResponse.respond({
                                    message_type:
                                        nodeType === NodeType.Treasure
                                            ? SWARMessageType.EndTreasure
                                            : SWARMessageType.EndCombat,
                                    action: SWARAction.SelectAnotherReward,
                                    data: {
                                        rewards,
                                    },
                                }),
                            );
                        });

                    await this.fullSyncAction.handle(client, false);
                } catch (error) {
                    this.logger.error({
                        error,
                    });
                }
                this.logger.debug('</REWARD SELECTED>');
            },
        );
    }
}
