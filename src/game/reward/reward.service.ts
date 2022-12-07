import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { pick, sample } from 'lodash';
import { getRandomBetween, getRandomItemByWeight } from 'src/utils';
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
    Reward,
} from '../components/expedition/expedition.interface';

@Injectable()
export class RewardService {
    constructor(private readonly cardService: CardService) {}

    private node: IExpeditionNode;

    async generateRewards(node: IExpeditionNode): Promise<Reward[]> {
        this.node = node;

        const rewards: Reward[] = [];

        // First we check if is a combat node, them we apply the conditions
        // to generate the coins
        if (node.type === ExpeditionMapNodeTypeEnum.Combat) {
            const goldAmount = this.generateCoins();
            const cards = await this.generateCards();

            // Only if we get coins we should add that reward
            if (goldAmount > 0) {
                rewards.push({
                    id: randomUUID(),
                    type: IExpeditionNodeReward.Gold,
                    amount: goldAmount,
                    taken: false,
                });
            }

            // Only if we get cards for the rewards
            if (cards.length > 0) rewards.push(...cards);
        }

        return rewards;
    }

    private generateCoins(): number {
        switch (this.node.subType) {
            case ExpeditionMapNodeTypeEnum.CombatStandard:
                return getRandomBetween(10, 20);
            case ExpeditionMapNodeTypeEnum.CombatElite:
                return getRandomBetween(25, 35);
            case ExpeditionMapNodeTypeEnum.CombatBoss:
                return getRandomBetween(95, 105);
            default:
                return 0;
        }
    }

    private async generateCards(): Promise<CardReward[]> {
        const cardRewards: CardReward[] = [];

        const cards = await this.cardService.find({
            isActive: true,
            cardType: {
                $nin: [CardTypeEnum.Status, CardTypeEnum.Curse],
            },
        });

        // First we create a loop for 3 cards
        for (let i = 1; i <= 3; i++) {
            // Next, we go through the probabilities for each card rarity
            const cardRarity: CardRarityEnum = this.getCardTypeProbability();

            // Here we get all the card ids that we have as reward to
            // Avoid repetition
            const cardIds = cardRewards.map((reward) => reward.card.cardId);

            // Now we query a random card that is not in the
            // card rewards array already
            const card = sample(
                cards
                    .filter((card) => card.rarity === cardRarity)
                    .filter((card) => !cardIds.includes(card.cardId)),
            );

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

    private getCardTypeProbability(): CardRarityEnum {
        switch (this.node.subType) {
            case ExpeditionMapNodeTypeEnum.CombatStandard:
                return getRandomItemByWeight(
                    [
                        CardRarityEnum.Common,
                        CardRarityEnum.Uncommon,
                        CardRarityEnum.Rare,
                    ],
                    [0.6, 0.37, 0.03],
                );
            case ExpeditionMapNodeTypeEnum.CombatElite:
                return getRandomItemByWeight(
                    [
                        CardRarityEnum.Common,
                        CardRarityEnum.Uncommon,
                        CardRarityEnum.Rare,
                        CardRarityEnum.Legendary,
                    ],
                    [0.5, 0.38, 0.09, 0.03],
                );
            case ExpeditionMapNodeTypeEnum.CombatStandard:
                return getRandomItemByWeight(
                    [CardRarityEnum.Rare, CardRarityEnum.Legendary],
                    [0.8, 0.2],
                );
        }
    }
}
