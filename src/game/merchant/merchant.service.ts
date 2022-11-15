import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { Injectable } from '@nestjs/common';
import { getRandomBetween } from 'src/utils';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { CardDocument } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';
import { CardId, getCardIdField } from '../components/card/card.type';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import {
    IExpeditionPlayerState,
    IExpeditionPlayerStateDeckCard,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { PotionService } from '../components/potion/potion.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { TrinketService } from '../components/trinket/trinket.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { Item, MerchantItems, selectedItem } from './interfaces';
import {
    CardCommon,
    ItemsTypeEnum,
    CardRare,
    CardUncommon,
    PotionCommon,
    PotionUncommon,
    PotionRare,
    TrinketCommon,
    TrinketUncommon,
    TrinketRare,
} from './merchant.enum';

@Injectable()
export class MerchantService {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
        private readonly trinketService: TrinketService,
    ) {}

    merchantBuy(client: Socket, selectedItem: selectedItem) {
        switch (selectedItem.type) {
            case ItemsTypeEnum.Card:
            case ItemsTypeEnum.Trinket:
            case ItemsTypeEnum.Potion:
                this.handle(client, selectedItem);
                break;
            case ItemsTypeEnum.Destroy:
                this.cardDestroy(client, selectedItem.targetId);
                break;
            case ItemsTypeEnum.Upgrade:
                this.cardUpgrade(client, selectedItem.targetId);
                return;
        }
    }

    async handle(client: Socket, selectedItem: selectedItem) {
        const { targetId, type } = selectedItem;

        const {
            _id,
            playerState,
            currentNode: { merchantItems, nodeType },
        } = await this.expeditionService.findOne({
            clientId: client.id,
        });

        if (nodeType !== ExpeditionMapNodeTypeEnum.Merchant) {
            client.emit('ErrorMessage', {
                message: `You are not in the merchant node`,
            });
            return;
        }

        let item: Item;
        let itemIndex: number;
        let data: Item[];
        switch (type) {
            case ItemsTypeEnum.Card:
                data = merchantItems.cards;
                break;
            case ItemsTypeEnum.Trinket:
                data = merchantItems.trinkets;
                break;
            case ItemsTypeEnum.Potion:
                data = merchantItems.potions;
                break;
        }
        for (let i = 0; i < data.length; i++) {
            if (typeof targetId == 'string') {
                if (targetId == data[i].id) {
                    item = data[i];
                    itemIndex = i;
                }
            } else if (typeof targetId == 'number') {
                if (targetId == data[i].itemId) {
                    item = data[i];
                    itemIndex = i;
                }
            }
        }

        if (!item) {
            client.emit('ErrorMessage', {
                message: `Invalid id`,
            });
            return;
        }

        if (playerState.gold < item.cost) {
            client.emit('ErrorMessage', {
                message: `Not enough gold`,
            });
            return;
        }

        switch (type) {
            case ItemsTypeEnum.Card:
                await this.handleCard(
                    merchantItems,
                    item,
                    itemIndex,
                    playerState,
                    _id,
                );
                break;
            case ItemsTypeEnum.Potion:
                if (playerState.potions.length > 2) {
                    client.emit('ErrorMessage', {
                        message: `You cannot carry any more potions. Discard or use one to buy a potion.`,
                    });
                    return;
                }
                await this.handlePotions(
                    merchantItems,
                    item,
                    itemIndex,
                    playerState,
                    _id,
                );
                break;
            case ItemsTypeEnum.Trinket:
                await this.handleTrinkets(
                    merchantItems,
                    item,
                    itemIndex,
                    playerState,
                    _id,
                );
                break;
        }

        this.success(client);
    }

    async handleCard(
        merchantItems: MerchantItems,
        item: Item,
        itemIndex: number,
        playerState: IExpeditionPlayerState,
        _id: string,
    ) {
        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.cost,
            cards: [...playerState.cards, item.item],
        };

        const mewMerchantItems = {
            ...merchantItems,
        };
        mewMerchantItems.cards[itemIndex].isSold = true;

        await this.expeditionService.updateById(_id, {
            $set: {
                playerState: newPlayerState,
                'currentNode.merchantItems': mewMerchantItems,
            },
        });
    }

    async handlePotions(
        merchantItems: MerchantItems,
        item: Item,
        itemIndex: number,
        playerState: IExpeditionPlayerState,
        _id: string,
    ) {
        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.cost,
            potions: [...playerState.potions, item.item],
        };
        const mewMerchantItems = {
            ...merchantItems,
        };
        mewMerchantItems.potions[itemIndex].isSold = true;

        await this.expeditionService.updateById(_id, {
            $set: {
                playerState: newPlayerState,
                'currentNode.merchantItems': mewMerchantItems,
            },
        });
    }

    async handleTrinkets(
        merchantItems: MerchantItems,
        item: Item,
        itemIndex: number,
        playerState: IExpeditionPlayerState,
        _id: string,
    ) {
        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.cost,
            trinkets: [...playerState.trinkets, item.item],
        };

        const mewMerchantItems = {
            ...merchantItems,
        };
        mewMerchantItems.trinkets[itemIndex].isSold = true;

        await this.expeditionService.updateById(_id, {
            $set: {
                playerState: newPlayerState,
                'currentNode.merchantItems': mewMerchantItems,
            },
        });
    }

    async getCard() {
        const attackCard = await this.cardService.randomCards(
            2,
            CardTypeEnum.Attack,
        );
        const defenseCard = await this.cardService.randomCards(
            1,
            CardTypeEnum.Defend,
        );
        const skillCard = await this.cardService.randomCards(
            1,
            CardTypeEnum.Skill,
        );
        const powerCard = await this.cardService.randomCards(
            2,
            CardTypeEnum.Power,
        );
        const cards: CardDocument[] = [
            ...attackCard,
            ...defenseCard,
            ...skillCard,
            ...powerCard,
        ];
        const itemsData: Item[] = [];

        for (let i = 0; i < cards.length; i++) {
            let cost: number = null;

            switch (cards[i].rarity) {
                case CardRarityEnum.Common:
                    cost = getRandomBetween(
                        CardCommon.minPrice,
                        CardCommon.maxPrice,
                    );
                    break;
                case CardRarityEnum.Uncommon:
                    cost = getRandomBetween(
                        CardUncommon.minPrice,
                        CardUncommon.maxPrice,
                    );
                    break;
                case CardRarityEnum.Rare:
                    cost = getRandomBetween(
                        CardRare.minPrice,
                        CardRare.maxPrice,
                    );
                    break;
            }

            const data = {
                isSale: false,
                id: randomUUID(),
                isSold: false,
                itemId: cards[i].cardId,
            };
            itemsData.push({
                ...data,
                cost,
                type: ItemsTypeEnum.Card,
                item: {
                    id: data.id,
                    cardId: cards[i].cardId,
                    name: cards[i].name,
                    rarity: cards[i].rarity,
                    cardType: cards[i].cardType,
                    pool: cards[i].pool,
                    energy: cards[i].energy,
                    description: CardDescriptionFormatter.process(cards[i]),
                    isTemporary: false,
                    properties: cards[i].properties,
                    keywords: cards[i].keywords,
                    showPointer: cards[i].showPointer,
                    isUpgraded: cards[i].isUpgraded,
                    upgradedCardId: cards[i].upgradedCardId,
                },
            });
        }

        const randomIndex: number = getRandomBetween(0, itemsData.length);
        itemsData[randomIndex] = {
            ...itemsData[randomIndex],
            isSale: true,
            cost: Math.floor(itemsData[randomIndex].cost / 2),
        };

        return itemsData;
    }

    async getPotions() {
        const potions = await this.potionService.randomPotion(5);

        const itemsData: Item[] = [];

        for (let i = 0; i < potions.length; i++) {
            let cost: number = null;

            switch (potions[i].rarity) {
                case PotionRarityEnum.Common:
                    cost = getRandomBetween(
                        PotionCommon.minPrice,
                        PotionCommon.maxPrice,
                    );
                    break;
                case PotionRarityEnum.Uncommon:
                    cost = getRandomBetween(
                        PotionUncommon.minPrice,
                        PotionUncommon.maxPrice,
                    );
                    break;
                case PotionRarityEnum.Rare:
                    cost = getRandomBetween(
                        PotionRare.minPrice,
                        PotionRare.maxPrice,
                    );
                    break;
            }

            const data = {
                id: randomUUID(),
                isSold: false,
                itemId: potions[i].potionId,
            };

            itemsData.push({
                ...data,
                cost,
                type: ItemsTypeEnum.Potion,
                item: {
                    potionId: potions[i].potionId,
                    name: potions[i].name,
                    rarity: potions[i].rarity,
                    description: potions[i].description,
                    effects: potions[i].effects,
                    usableOutsideCombat: potions[i].usableOutsideCombat,
                    showPointer: potions[i].showPointer,
                    id: data.id,
                },
            });
        }

        return itemsData;
    }

    async getTrinket() {
        const trinkets = await this.trinketService.randomTrinket(5);

        const itemsData: Item[] = [];

        for (let i = 0; i < trinkets.length; i++) {
            let cost: number = null;

            switch (trinkets[i].rarity) {
                case TrinketRarityEnum.Common:
                    cost = getRandomBetween(
                        TrinketCommon.minPrice,
                        TrinketCommon.maxPrice,
                    );

                    break;
                case TrinketRarityEnum.Uncommon:
                    cost = getRandomBetween(
                        TrinketUncommon.minPrice,
                        TrinketUncommon.maxPrice,
                    );

                    break;
                case TrinketRarityEnum.Rare:
                    cost = getRandomBetween(
                        TrinketRare.minPrice,
                        TrinketRare.maxPrice,
                    );
                    break;
            }

            const data = {
                id: randomUUID(),
                isSold: false,
                itemId: trinkets[i].trinketId,
            };

            itemsData.push({
                ...data,
                cost,
                type: ItemsTypeEnum.Trinket,
                item: {
                    id: data.id,
                    trinketId: trinkets[i].trinketId,
                    name: trinkets[i].name,
                    rarity: trinkets[i].rarity,
                    description: trinkets[i].description,
                    effects: trinkets[i].effects,
                },
            });
        }
        return itemsData;
    }

    async success(client: Socket) {
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const { playerState, playerId } = expedition || {};

        client.emit(
            'MerchantBuy',
            StandardResponse.respond({
                message_type: SWARMessageType.MerchantUpdate,
                action: SWARAction.PurchaseSuccess,
                data: null,
            }),
        );

        client.emit(
            'PlayerState',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerStateUpdate,
                action: SWARAction.UpdatePlayerState,
                data: {
                    playerState: {
                        id: playerState.playerId,
                        playerId,
                        playerName: playerState.playerName,
                        characterClass: playerState.characterClass,
                        hpMax: playerState.hpMax,
                        hpCurrent: playerState.hpCurrent,
                        gold: playerState.gold,
                        cards: playerState.cards,
                        potions: playerState.potions,
                        trinkets: playerState.trinkets,
                    },
                },
            }),
        );
    }

    async playerCards(client: Socket) {
        const { cards } = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });

        return cards;
    }
    async cardUpgrade(client: Socket, cardId: CardId) {
        const playerState = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });
        const upgradedPrice = 75 + 25 * playerState.cardUpgradeCount;
        if (playerState.gold < upgradedPrice) {
            client.emit('ErrorMessage', {
                message: `Not enough gold`,
            });
            return;
        }

        const card = await this.cardService.findById(cardId);

        if (card) {
            for (let i = 0; i < playerState.cards.length; i++) {
                if (card.cardId == playerState.cards[i].cardId) {
                    break;
                } else if (i === playerState.cards.length - 1) {
                    client.emit('ErrorMessage', {
                        message: `Card not in merchant offer`,
                    });
                    return;
                }
            }
        } else {
            client.emit('ErrorMessage', {
                message: `Card not in merchant offer`,
            });
            return;
        }
        if (!card.isUpgraded && !card.upgradedCardId) {
            client.emit('ErrorMessage', {
                message: `Card could be not upgraded`,
            });
            return;
        }
        const upgradedCardData = await this.cardService.findById(
            card.upgradedCardId,
        );

        const upgradedCard: IExpeditionPlayerStateDeckCard = {
            id: randomUUID(),
            cardId: card.cardId,
            name: upgradedCardData.name,
            cardType: upgradedCardData.cardType,
            energy: upgradedCardData.energy,
            description: CardDescriptionFormatter.process(upgradedCardData),
            isTemporary: false,
            rarity: upgradedCardData.rarity,
            properties: upgradedCardData.properties,
            keywords: upgradedCardData.keywords,
            showPointer: upgradedCardData.showPointer,
            pool: upgradedCardData.pool,
            isUpgraded: upgradedCardData.isUpgraded,
        };

        const id = getCardIdField(cardId);

        let isUpgraded = false;

        const newCard = playerState.cards.map((item) => {
            if (item[id] == card[id] && !isUpgraded) {
                isUpgraded = true;
                return upgradedCard;
            } else {
                return item;
            }
        });

        const newGold = playerState.gold - upgradedPrice;
        const newCardUpgradeCount = playerState.cardUpgradeCount + 1;

        const newPlayerState = {
            ...playerState,
            cards: newCard,
            gold: newGold,
            cardUpgradeCount: newCardUpgradeCount,
        };

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    playerState: newPlayerState,
                },
            },
        );

        this.success(client);
    }
    async cardDestroy(client: Socket, cardId: CardId) {
        const playerState = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });
        const destroyPrice = 75 + 25 * playerState.cardDestroyCount;
        if (playerState.gold < destroyPrice) {
            client.emit('ErrorMessage', {
                message: `Not enough gold`,
            });
            return;
        }

        const card = await this.cardService.findById(cardId);

        let cardIndex: number = null;

        if (card) {
            for (let i = 0; i < playerState.cards.length; i++) {
                if (card.cardId == playerState.cards[i].cardId) {
                    cardIndex = i;
                    break;
                }
            }
        }
        if (cardIndex === null) {
            client.emit('ErrorMessage', {
                message: `Card not in merchant offer`,
            });
            return;
        }
        playerState.cards.splice(cardIndex, 1);
        playerState.cardDestroyCount = playerState.cardDestroyCount + 1;
        playerState.gold = playerState.gold - destroyPrice;

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    playerState,
                },
            },
        );

        this.success(client);
    }
}
