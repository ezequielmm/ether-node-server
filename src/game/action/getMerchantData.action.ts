import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class GetMerchantDataAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    async handle(clientId: string) {
        const {
            playerState,
            playerState: { cards },
            currentNode: { merchantItems },
        } = await this.expeditionService.findOne({
            clientId,
        });

        const data = {
            coins: playerState.gold,
            shopkeeper: 1,
            speechBubble: 'Hello',
            upgradeableCards: [],
            upgradedCards: [],
            playerCards: cards,
            upgradeCost: 75 + 25 * playerState.cardUpgradeCount,
            destroyCost: 75 + 25 * playerState.cardDestroyCount,
            cards: merchantItems.cards,
            neutralCards: [],
            trinkets: merchantItems.trinkets,
            potions: merchantItems.potions,
        };

        const cardIds: number[] = [];

        for (const card of cards) {
            if (!card.isUpgraded) {
                data.upgradeableCards.push(card);
                cardIds.push(card.upgradedCardId);
            }
        }

        const upgradedCards = await this.cardService.findCardsById(cardIds);

        for (const card of upgradedCards) {
            data.upgradedCards.push({
                id: randomUUID(),
                cardId: card.cardId,
                name: card.name,
                cardType: card.cardType,
                energy: card.energy,
                description: CardDescriptionFormatter.process(card),
                isTemporary: false,
                rarity: card.rarity,
                properties: card.properties,
                keywords: card.keywords,
                showPointer: card.showPointer,
                pool: card.pool,
                isUpgraded: card.isUpgraded,
                isActive: true,
            });
        }

        return data;
    }
}
