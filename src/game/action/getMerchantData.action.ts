import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { sample } from 'lodash';
@Injectable()
export class GetMerchantDataAction {
    private greetings: string[];
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {
        this.greetings = [
            "Greetings, Traveler! Best wares in the Fen. What'll it be?",
            "Welcome Adventurer! Some fine items for ye, I've got. What catches your eye?",
            "A customer! It's been so long! Perhaps I've something that could be of use?",
            'No need to dawdle. Make your choices and move along...',
        ];
    }

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
            speechBubble: sample(this.greetings),
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
