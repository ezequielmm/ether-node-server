import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionService } from '../components/potion/potion.service';
import { TrinketService } from '../components/trinket/trinket.service';

@Injectable()
export class GetMerchantDataAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
        private readonly trinketService: TrinketService,
    ) {}

    async handle(clientId: string) {
        const {
            playerState,
            playerState: { cards: playerCard },
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
            playerCards: playerCard,
            upgradeCost: 75 + 25 * playerState.cardUpgradeCount,
            destroyCost: 75 + 25 * playerState.cardDestroyCount,
            cards: merchantItems.cards,
            neutralCards: [],
            trinkets: merchantItems.trinkets,
            potions: merchantItems.potions,
        };

        const cardsId = [];

        for (let i = 0; i < playerCard.length; i++) {
            if (!playerCard[i].isUpgraded) {
                data.upgradeableCards.push(playerCard[i]);
                cardsId.push(playerCard[i].upgradedCardId);
            }
        }

        const upgradeableCards = await this.cardService.findCardsById(cardsId);

        let index = -1;
        let id = null;

        for (let i = 0; i < cardsId.length; i++) {
            if (cardsId[i] !== id) {
                id = cardsId[i];
                index = index + 1;
            }

            const upgradedCard: IExpeditionPlayerStateDeckCard = {
                id: randomUUID(),
                cardId: data.upgradeableCards[i].cardId,
                name: upgradeableCards[index].name,
                cardType: upgradeableCards[index].cardType,
                energy: upgradeableCards[index].energy,
                description: CardDescriptionFormatter.process(
                    upgradeableCards[index],
                ),
                isTemporary: false,
                rarity: upgradeableCards[index].rarity,
                properties: upgradeableCards[index].properties,
                keywords: upgradeableCards[index].keywords,
                showPointer: upgradeableCards[index].showPointer,
                pool: upgradeableCards[index].pool,
                isUpgraded: upgradeableCards[index].isUpgraded,
            };
            data.upgradedCards.push(upgradedCard);
        }

        return data;
    }
}
