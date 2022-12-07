import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { pick } from 'lodash';
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
    PotionReward,
    Reward,
} from '../components/expedition/expedition.interface';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { PotionService } from '../components/potion/potion.service';

interface GenerateRewardsDTO {
    node: IExpeditionNode;
    willGenerateGold: boolean;
    cardsToGenerate: number;
    potionsToGenerate: number;
}

@Injectable()
export class RewardService {
    constructor(
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
    ) {}

    private node: IExpeditionNode;

    async generateRewards(payload: GenerateRewardsDTO): Promise<Reward[]> {
        const { node, willGenerateGold, cardsToGenerate, potionsToGenerate } =
            payload;

        this.node = node;

        const rewards: Reward[] = [];

        if (willGenerateGold) {
            const goldAmount = this.generateCoins();
            // Only if we get coins we should add that reward
            if (goldAmount > 0) {
                rewards.push({
                    id: randomUUID(),
                    type: IExpeditionNodeReward.Gold,
                    amount: goldAmount,
                    taken: false,
                });
            }
        }

        if (cardsToGenerate > 0) {
            const cards = await this.generateCards();
            // Only if we get cards for the rewards
            if (cards.length > 0) rewards.push(...cards);
        }

        if (potionsToGenerate > 0) {
            const potions = await this.generatePotions();

            // Only if we get potions for the rewards
            if (potions.length > 0) rewards.push(...potions);
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

    private async generateCards(amount = 3): Promise<CardReward[]> {
        const cardRewards: CardReward[] = [];

        // First we create a loop for 3 cards
        for (let i = 1; i <= amount; i++) {
            // Next, we go through the probabilities for each card rarity
            const cardRarity: CardRarityEnum = this.getCardRarityProbability();

            // Here we get all the card ids that we have as reward to
            // Avoid repetition
            const cardIds = cardRewards.map((reward) => reward.card.cardId);

            // Now we query a random card that is not in the
            // card rewards array already
            const card = await this.cardService.getRandomCard({
                isActive: true,
                rarity: cardRarity,
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

    private async generatePotions(amount = 1): Promise<PotionReward[]> {
        const potionRewards: PotionReward[] = [];

        for (let i = 1; i <= amount; i++) {
            const potionRarity: PotionRarityEnum =
                this.getPotionRarityProbability();

            const potion = await this.potionService.getRandomPotion({
                isActive: true,
                rarity: potionRarity,
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

    private getCardRarityProbability(): CardRarityEnum {
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

    private getPotionRarityProbability = (): PotionRarityEnum =>
        getRandomItemByWeight(
            [
                PotionRarityEnum.Common,
                PotionRarityEnum.Uncommon,
                PotionRarityEnum.Rare,
            ],
            [0.65, 0.25, 0.1],
        );
}
