import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionService } from '../components/potion/potion.service';
import { TrinketService } from '../components/trinket/trinket.service';
import { ItemsTypeEnum } from '../merchant/merchant.enum';

@Injectable()
export class GetMerchantDataAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
        private readonly trinketService: TrinketService,
    ) {}

    async handle(clientId: string) {
        const { nodeId } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        const {
            private_data: { cards, trinkets, potions },
        } = await this.expeditionService.getExpeditionMapNode({
            clientId,
            nodeId,
        });
        const playerState = await this.expeditionService.getPlayerState({
            clientId,
        });
        const { cards: playerCard } =
            await this.expeditionService.getPlayerState({
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
            cards: [],
            neutralCards: [],
            trinkets: [],
            potions: [],
        };

        for (let i = 0; i < playerCard.length; i++) {
            if (!playerCard[i].isUpgraded) {
                data.upgradeableCards.push(playerCard[i]);
                const upgradedCardData = await this.cardService.findById(
                    playerCard[i].upgradedCardId,
                );

                const upgradedCard: IExpeditionPlayerStateDeckCard = {
                    id: randomUUID(),
                    cardId: playerCard[i].cardId,
                    name: upgradedCardData.name,
                    cardType: upgradedCardData.cardType,
                    energy: upgradedCardData.energy,
                    description:
                        CardDescriptionFormatter.process(upgradedCardData),
                    isTemporary: false,
                    rarity: upgradedCardData.rarity,
                    properties: upgradedCardData.properties,
                    keywords: upgradedCardData.keywords,
                    showPointer: upgradedCardData.showPointer,
                    pool: upgradedCardData.pool,
                    isUpgraded: upgradedCardData.isUpgraded,
                };
                data.upgradedCards.push(upgradedCard);
            }
        }

        for (let i = 0; i < cards.length; i++) {
            const card = await this.cardService.findById(cards[i].itemId);
            delete card._id;
            delete card.__v;
            data.cards.push({
                itemId: card.cardId,
                cost: cards[i].cost,
                isSold: cards[i].isSold,
                isSale: cards[i].isSale,
                type: ItemsTypeEnum.Card,
                id: cards[i].id,
                item: { ...card, id: cards[i].id, isTemporary: false },
            });
        }

        for (let i = 0; i < potions.length; i++) {
            const potion = await this.potionService.findById(potions[i].itemId);
            delete potion._id;
            delete potion.__v;
            data.potions.push({
                itemId: potion.potionId,
                cost: potions[i].cost,
                isSold: potions[i].isSold,
                type: ItemsTypeEnum.Potion,
                id: potions[i].id,
                item: { ...potion, id: potions[i].id },
            });
        }

        for (let i = 0; i < trinkets.length; i++) {
            const trinket = await this.trinketService.findById(
                trinkets[i].itemId,
            );
            delete trinket._id;
            delete trinket.__v;
            data.trinkets.push({
                itemId: trinket.trinketId,
                cost: trinkets[i].cost,
                isSold: trinkets[i].isSold,
                type: ItemsTypeEnum.Trinket,
                id: trinkets[i].id,
                item: { ...trinket, id: trinkets[i].id },
            });
        }
        return data;
    }
}
