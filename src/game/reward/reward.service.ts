import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { pick } from 'lodash';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { CardService } from '../components/card/card.service';
import { IExpeditionNodeReward } from '../components/expedition/expedition.enum';
import {
    CardPreview,
    CardReward,
    IExpeditionNode,
    PotionReward,
    Reward,
    TrinketReward,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { PotionService } from '../components/potion/potion.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { TrinketService } from '../components/trinket/trinket.service';

@Injectable()
export class RewardService {
    constructor(
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
        private readonly trinketService: TrinketService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    private node: IExpeditionNode;
    private clientId: string;

    async generateRewards({
        cardsToGenerate,
        potionsToGenerate,
        trinketsToGenerate,
        coinsToGenerate,
        node,
        clientId,
    }: {
        clientId: string;
        node: IExpeditionNode;
        coinsToGenerate: number;
        cardsToGenerate: CardRarityEnum[];
        potionsToGenerate: PotionRarityEnum[];
        trinketsToGenerate: TrinketRarityEnum[];
    }): Promise<Reward[]> {
        this.node = node;
        this.clientId = clientId;

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
            const trinkets = await this.generateTrinkets(trinketsToGenerate);

            if (trinkets.length > 0) rewards.push(...trinkets);
        }

        return rewards;
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
        trinketsToGenerate: TrinketRarityEnum[],
    ): Promise<TrinketReward[]> {
        const trinketRewards: TrinketReward[] = [];

        const { trinkets } = await this.expeditionService.getPlayerState({
            clientId: this.clientId,
        });

        const trinketIds = trinkets.map(({ trinketId }) => trinketId);

        for (let i = 0; i < trinketRewards.length; i++) {
            const trinket = await this.trinketService.getRandomTrinket({
                isActive: true,
                rarity: trinketsToGenerate[i],
                ...(trinketIds.length > 0 && {
                    trinketId: {
                        $nin: trinketIds,
                    },
                }),
            });

            if (trinket)
                trinketRewards.push({
                    id: randomUUID(),
                    type: IExpeditionNodeReward.Trinket,
                    taken: false,
                    trinket: pick(trinket, [
                        'trinketId',
                        'name',
                        'description',
                    ]),
                });
        }

        return trinketRewards;
    }
}
