import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { chain, filter, find, includes, map, pick } from 'lodash';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { CardService } from '../components/card/card.service';
import {
    ExpeditionMapNodeTypeEnum,
    IExpeditionNodeReward,
} from '../components/expedition/expedition.enum';
import {
    CardPreview,
    CardReward,
    IExpeditionNode,
    PotionReward,
    Reward,
    TrinketReward,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { PotionService } from '../components/potion/potion.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { TrinketService } from '../components/trinket/trinket.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';

@Injectable()
export class RewardService {
    constructor(
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
        private readonly trinketService: TrinketService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    private node: IExpeditionNode;

    async generateRewards({
        ctx,
        cardsToGenerate,
        potionsToGenerate,
        trinketsToGenerate,
        coinsToGenerate,
        node,
    }: {
        ctx: GameContext;
        node: IExpeditionNode;
        coinsToGenerate: number;
        cardsToGenerate: CardRarityEnum[];
        potionsToGenerate: PotionRarityEnum[];
        trinketsToGenerate: TrinketRarityEnum[];
    }): Promise<Reward[]> {
        this.node = node;

        const rewards: Reward[] = [];

        if (coinsToGenerate > 0) {
            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Gold,
                amount: coinsToGenerate,
                taken: false,
            });
        }

        if (cardsToGenerate.length > 0) {
            const cards = await this.generateCards(cardsToGenerate);
            // Only if we get cards for the rewards
            if (cards.length > 0) rewards.push(...cards);
        }

        if (potionsToGenerate.length > 0) {
            const potions = await this.generatePotions(potionsToGenerate);

            // Only if we get potions for the rewards
            if (potions.length > 0) rewards.push(...potions);
        }

        if (trinketsToGenerate.length > 0) {
            const trinkets = await this.generateTrinkets(
                ctx,
                trinketsToGenerate,
            );

            if (trinkets.length > 0) rewards.push(...trinkets);
        }

        return rewards;
    }

    async takeReward(ctx: GameContext, rewardId: string): Promise<string> {
        // Get the updated expedition
        const expedition = ctx.expedition;

        const {
            currentNode: { completed: nodeIsCompleted, nodeType },
        } = expedition;

        const expeditionId = expedition._id.toString();

        let rewards: Reward[] = [];

        rewards =
            nodeType === ExpeditionMapNodeTypeEnum.Treasure
                ? expedition.currentNode.treasureData.rewards
                : expedition.currentNode.data.rewards;

        if (nodeIsCompleted) {
            // Check if the node is completed
            throw new CustomException(
                'Node already completed, cannot select reward',
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        // check if the reward that we are receiving is correct and exists
        const reward = find(rewards, { id: rewardId });

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
                    reward.taken = reward.type === IExpeditionNodeReward.Card;
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

    private async generateCards(
        cardsToGenerate: CardRarityEnum[],
    ): Promise<CardReward[]> {
        const cardRewards: CardReward[] = [];

        // First we create a loop for 3 cards
        for (let i = 0; i < cardsToGenerate.length; i++) {
            // Here we get all the card ids that we have as reward to
            // Avoid repetition
            const cardIds = cardRewards.map((reward) => reward.card.cardId);

            // Now we query a random card that is not in the
            // card rewards array already
            const card = await this.cardService.getRandomCard({
                isActive: true,
                rarity: cardsToGenerate[i],
                cardType: { $nin: [CardTypeEnum.Curse, CardTypeEnum.Status] },
                cardId: { $nin: cardIds },
                isUpgraded: this.node.act > 1,
            });

            const cardPreview = pick(card, [
                'cardId',
                'name',
                'description',
                'energy',
                'rarity',
                'cardType',
                'pool',
                'isUpgraded',
            ]) as unknown as CardPreview;

            cardPreview.description = CardDescriptionFormatter.process(card);

            cardRewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Card,
                card: cardPreview,
                taken: false,
            });
        }

        return cardRewards;
    }

    private async generatePotions(
        potionsToGenerate: PotionRarityEnum[],
    ): Promise<PotionReward[]> {
        const potionRewards: PotionReward[] = [];

        for (let i = 0; i < potionsToGenerate.length; i++) {
            const potion = await this.potionService.getRandomPotion({
                isActive: true,
                rarity: potionsToGenerate[i],
            });

            if (potion)
                potionRewards.push({
                    id: randomUUID(),
                    type: IExpeditionNodeReward.Potion,
                    taken: false,
                    potion: pick(potion, ['potionId', 'name', 'description']),
                });
        }

        return potionRewards;
    }

    private async generateTrinkets(
        ctx: GameContext,
        trinketRarities: TrinketRarityEnum[],
    ): Promise<TrinketReward[]> {
        const trinketToReject = map(
            ctx.expedition.playerState.trinkets,
            'trinketId',
        );

        return chain(this.trinketService.findAll())
            .reject((trinket) => includes(trinketToReject, trinket.trinketId))
            .reject((trinket) => includes(trinketRarities, trinket.rarity))
            .uniqBy('rarity')
            .map<TrinketReward>((trinket) => ({
                id: randomUUID(),
                type: IExpeditionNodeReward.Trinket,
                taken: false,
                trinket: pick(trinket, ['trinketId', 'name', 'description']),
            }))
            .value();
    }
}
