import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
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
import { TrinketService } from '../components/trinket/trinket.service';
import { restoreMap } from '../map/app';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { Item, selectedItem } from './interfaces';
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
    private readonly logger = new Logger(MerchantService.name);
    constructor(
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => CardService))
        private readonly cardService: CardService,
        @Inject(forwardRef(() => PotionService))
        private readonly potionService: PotionService,
        @Inject(forwardRef(() => TrinketService))
        private readonly trinketService: TrinketService,
    ) {}

    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

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
        const { nodeType, nodeId } =
            await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

        if (nodeType !== ExpeditionMapNodeTypeEnum.Merchant) {
            client.emit('ErrorMessage', {
                message: `You are not in the merchant node`,
            });
            return;
        }

        const node = await this.expeditionService.getExpeditionMapNode({
            clientId: client.id,
            nodeId,
        });

        let item: Item;

        let itemIndex: number;

        let data: Item[];

        switch (type) {
            case ItemsTypeEnum.Card:
                data = node.private_data.cards;
                break;
            case ItemsTypeEnum.Trinket:
                data = node.private_data.trinkets;
                break;
            case ItemsTypeEnum.Potion:
                data = node.private_data.potions;
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

        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });
        const { playerState, _id } = expedition || {};

        if (playerState.gold < item.cost) {
            client.emit('ErrorMessage', {
                message: `Not enough gold`,
            });
            return;
        }

        switch (type) {
            case ItemsTypeEnum.Card:
                await this.handleCard(item, playerState, _id);
                break;
            case ItemsTypeEnum.Potion:
                if (playerState.potions.length > 2) {
                    client.emit('ErrorMessage', {
                        message: `You cannot carry any more potions. Discard or use one to buy a potion.`,
                    });
                    return;
                }
                await this.handlePotions(item, playerState, _id);
                break;
            case ItemsTypeEnum.Trinket:
                client.emit('ErrorMessage', {
                    message: `Not allowed element`,
                });
                return;
        }
        const map = await this.expeditionService.getExpeditionMap({
            clientId: client.id,
        });
        const expeditionMap = restoreMap(map);

        const selectedNode = expeditionMap.fullCurrentMap.get(nodeId);

        switch (type) {
            case ItemsTypeEnum.Card:
                node.private_data.cards[itemIndex].isSold = true;
                break;
            // TODO
            // case ItemsTypeEnum.Trinket:
            //     node.private_data.trinkets[itemIndex].isSold = true;
            //     break;
            case ItemsTypeEnum.Potion:
                node.private_data.potions[itemIndex].isSold = true;
                break;
        }

        selectedNode.setPrivate_data(node.private_data);

        await this.expeditionService.update(client.id, {
            map: expeditionMap.getMap,
        });
        this.success(client);
    }
    async handleCard(
        item: Item,
        playerState: IExpeditionPlayerState,
        _id: string,
    ) {
        const card = await this.cardService.findById(item.itemId);

        const newCard = {
            id: item.id,
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
        };

        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.cost,
            cards: [...playerState.cards, newCard],
        };

        await this.expeditionService.updateById(_id, {
            $set: {
                playerState: newPlayerState,
            },
        });
    }
    async handlePotions(
        item: Item,
        playerState: IExpeditionPlayerState,
        _id: string,
    ) {
        const potion = await this.potionService.findById(item.itemId);
        delete potion._id;
        delete potion.__v;
        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.cost,
            potions: [...playerState.potions, { ...potion, id: item.id }],
        };

        await this.expeditionService.updateById(_id, {
            $set: {
                playerState: newPlayerState,
            },
        });
    }
    async card(): Promise<Item[]> {
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
        const card: CardDocument[] = [
            ...attackCard,
            ...defenseCard,
            ...skillCard,
            ...powerCard,
        ];

        const cardsForPlayer: Item[] = [];
        for (let i = 0; i < card.length; i++) {
            let cost: number = null;

            switch (card[i].rarity) {
                case CardRarityEnum.Common:
                    cost = this.random(
                        CardCommon.minPrice,
                        CardCommon.maxPrice,
                    );
                    break;
                case CardRarityEnum.Uncommon:
                    cost = this.random(
                        CardUncommon.minPrice,
                        CardUncommon.maxPrice,
                    );
                    break;
                case CardRarityEnum.Rare:
                    cost = this.random(CardRare.minPrice, CardRare.maxPrice);
                    break;
            }
            cardsForPlayer.push({
                isSale: false,
                id: randomUUID(),
                cost,
                isSold: false,
                itemId: card[i].cardId,
            });
        }

        const randomIndex: number = this.random(0, cardsForPlayer.length);
        cardsForPlayer[randomIndex] = {
            ...cardsForPlayer[randomIndex],
            isSale: true,
            cost: Math.floor(cardsForPlayer[randomIndex].cost / 2),
        };

        return cardsForPlayer;
    }
    async potions(): Promise<Item[]> {
        const potions = await this.potionService.randomPotion(5);
        const randomPotion: Item[] = [];
        for (let i = 0; i < potions.length; i++) {
            let cost: number = null;

            switch (potions[i].rarity) {
                case PotionRarityEnum.Common:
                    cost = this.random(
                        PotionCommon.minPrice,
                        PotionCommon.maxPrice,
                    );
                    break;
                case PotionRarityEnum.Uncommon:
                    cost = this.random(
                        PotionUncommon.minPrice,
                        PotionUncommon.maxPrice,
                    );
                    break;
                case PotionRarityEnum.Rare:
                    cost = this.random(
                        PotionRare.minPrice,
                        PotionRare.maxPrice,
                    );
                    break;
            }
            randomPotion.push({
                id: randomUUID(),
                cost,
                isSold: false,
                itemId: potions[i].potionId,
            });
        }
        return randomPotion;
    }
    async trinket(): Promise<Item[]> {
        const trinket = await this.trinketService.randomTrinket(5);
        const randomTrinket: Item[] = [];
        for (let i = 0; i < trinket.length; i++) {
            let cost: number = null;

            switch (trinket[i].rarity) {
                case PotionRarityEnum.Common:
                    cost = this.random(
                        TrinketCommon.minPrice,
                        TrinketCommon.maxPrice,
                    );

                    break;
                case PotionRarityEnum.Uncommon:
                    cost = this.random(
                        TrinketUncommon.minPrice,
                        TrinketUncommon.maxPrice,
                    );

                    break;
                case PotionRarityEnum.Rare:
                    cost = this.random(
                        TrinketRare.minPrice,
                        TrinketRare.maxPrice,
                    );
                    break;
            }
            randomTrinket.push({
                id: randomUUID(),
                cost,
                isSold: false,
                itemId: i,
            });
        }
        return randomTrinket;
    }
    async success(client: Socket) {
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });
        const { playerState, playerId } = expedition || {};
        client.emit(
            'MerchantBuy',
            StandardResponse.respond({
                message_type: SWARMessageType.MapUpdate,
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
                        trinkets: [],
                    },
                },
            }),
        );
    }
    async merchantData(client: Socket) {
        const { nodeId, nodeType } =
            await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

        if (nodeType !== ExpeditionMapNodeTypeEnum.Merchant) {
            client.emit('ErrorMessage', {
                message: `You are not in the merchant node`,
            });
            return;
        }
        const {
            private_data: { cards, trinkets, potions },
        } = await this.expeditionService.getExpeditionMapNode({
            clientId: client.id,
            nodeId,
        });
        const playerState = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });
        const playerCard = await this.playerCards(client);

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
                itemId: i, //TODO change to trinkets id when it will be ready
                cost: potions[i].cost,
                isSold: potions[i].isSold,
                type: ItemsTypeEnum.Trinket,
                id: trinkets[i].id,
                item: { ...trinket, id: trinkets[i].id },
            });
        }

        client.emit(
            'MerchantData',
            StandardResponse.respond({
                message_type: SWARMessageType.GenericData,
                action: SWARAction.MerchantData,
                data,
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
