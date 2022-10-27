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
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
        private readonly trinketService: TrinketService,
    ) {}

    async handle(client: Socket, selectedItem: selectedItem) {
        const { id, type } = selectedItem;
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

        const data = node.private_data[type];

        for (let i = 0; i < data.length; i++) {
            if (id == data[i].id.toString()) {
                item = data[i];
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

        if (playerState.gold < item.price) {
            client.emit('ErrorMessage', {
                message: `Not enough golds`,
            });
            return;
        }

        switch (type) {
            case ItemsTypeEnum.CardsForPlayer:
                await this.handleCard(item, playerState, _id);
                break;
            case ItemsTypeEnum.RandomPotions:
                if (playerState.potions.length > 2) {
                    client.emit('ErrorMessage', {
                        message: `You cannot carry any more potions. Discard or use one to buy a potion.`,
                    });
                    return;
                }
                await this.handlePotions(item, playerState, _id);
                break;
            case ItemsTypeEnum.RandomTrinkets:
                client.emit('ErrorMessage', {
                    message: `Not allowed element`,
                });
                return;
        }
        this.success(client);
    }

    async handleCard(
        item: Item,
        playerState: IExpeditionPlayerState,
        _id: string,
    ) {
        const card = await this.cardService.findById(item.id);
        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.price,
            cards: [...playerState.cards, card],
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
        const potion = await this.potionService.findById(item.id);
        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.price,
            potions: [...playerState.potions, potion],
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
            let price: number = null;

            switch (card[i].rarity) {
                case CardRarityEnum.Common:
                    price = getRandomBetween(
                        CardCommon.minCoin,
                        CardCommon.maxCoin,
                    );
                    break;
                case CardRarityEnum.Uncommon:
                    price = getRandomBetween(
                        CardUncommon.minCoin,
                        CardUncommon.maxCoin,
                    );
                    break;
                case CardRarityEnum.Rare:
                    price = getRandomBetween(
                        CardRare.minCoin,
                        CardRare.maxCoin,
                    );
                    break;
            }

            cardsForPlayer.push({
                isSale: false,
                id: card[i].cardId,
                price,
            });
        }

        const randomIndex: number = getRandomBetween(0, cardsForPlayer.length);
        cardsForPlayer[randomIndex] = {
            ...cardsForPlayer[randomIndex],
            isSale: true,
            price: Math.floor(cardsForPlayer[randomIndex].price / 2),
        };

        return cardsForPlayer;
    }

    async potions(): Promise<Item[]> {
        const potions = await this.potionService.randomPotion(5);
        const randomPotion: Item[] = [];

        for (let i = 0; i < potions.length; i++) {
            let price: number = null;

            switch (potions[i].rarity) {
                case PotionRarityEnum.Common:
                    price = getRandomBetween(
                        PotionCommon.minCoin,
                        PotionCommon.maxCoin,
                    );
                    break;
                case PotionRarityEnum.Uncommon:
                    price = getRandomBetween(
                        PotionUncommon.minCoin,
                        PotionUncommon.maxCoin,
                    );
                    break;
                case PotionRarityEnum.Rare:
                    price = getRandomBetween(
                        PotionRare.minCoin,
                        PotionRare.maxCoin,
                    );
                    break;
            }
            randomPotion.push({
                id: potions[i].potionId,
                price,
            });
        }

        return randomPotion;
    }

    async trinket(): Promise<Item[]> {
        const trinket = await this.trinketService.randomTrinket(5);
        const randomTrinket: Item[] = [];
        for (let i = 0; i < trinket.length; i++) {
            let price: number = null;

            switch (trinket[i].rarity) {
                case TrinketRarityEnum.Common:
                    price = getRandomBetween(
                        TrinketCommon.minCoin,
                        TrinketCommon.maxCoin,
                    );

                    break;
                case TrinketRarityEnum.Uncommon:
                    price = getRandomBetween(
                        TrinketUncommon.minCoin,
                        TrinketUncommon.maxCoin,
                    );

                    break;
                case TrinketRarityEnum.Rare:
                    price = getRandomBetween(
                        TrinketRare.minCoin,
                        TrinketRare.maxCoin,
                    );
                    break;
            }
            randomTrinket.push({
                id: trinket[i]._id,
                price,
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
            'PurchaseItem',
            StandardResponse.respond({
                message_type: SWARMessageType.PurchaseSuccess,
                action: SWARAction.ItemPurchasedWithSuccess,
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
            private_data: { cards, neutral_cards, trinkets, potions },
        } = await this.expeditionService.getExpeditionMapNode({
            clientId: client.id,
            nodeId,
        });
        const playerCard = await this.playerCards(client);
        const cardUpgrade = playerCard.filter((card) => !card.isUpgraded);

        const data = {
            cards: [],
            neutral_cards: [],
            trinkets: [],
            potions: [],
            playerCard,
            cardUpgrade,
        };
        for (let i = 0; i < cards.length; i++) {
            const card = await this.cardService.findById(cards[i].id);
            const price: number = cards[i].price;
            const isSale: boolean = cards[i].isSale;
            data.cards.push({ ...card, price, isSale });
        }
        for (let i = 0; i < potions.length; i++) {
            const potion = await this.potionService.findById(potions[i].id);
            const price: number = potions[i].price;
            data.potions.push({ ...potion, price });
        }
        for (let i = 0; i < trinkets.length; i++) {
            const trinket = await this.trinketService.findById(trinkets[i].id);
            const price: number = trinkets[i].price;
            data.trinkets.push({ ...trinket, price });
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
                        message: `Card not fount`,
                    });
                    return;
                }
            }
        } else {
            client.emit('ErrorMessage', {
                message: `Card not fount`,
            });
            return;
        }
        if (!card.isUpgraded && !card.upgradedCardId) {
            client.emit('ErrorMessage', {
                message: `Card not upgraded`,
            });
            return;
        }
        const upgradedCardData = await this.cardService.findById(
            card.upgradedCardId,
        );

        const upgradedCard: IExpeditionPlayerStateDeckCard = {
            id: randomUUID(),
            cardId: upgradedCardData.cardId,
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

        client.emit(
            'CardUpgrade',
            StandardResponse.respond({
                message_type: SWARMessageType.CardUpgrade,
                action: SWARAction.CardUpgrade,
                data: null,
            }),
        );
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
                message: `Card not fount`,
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

        client.emit(
            'CardDestroy',
            StandardResponse.respond({
                message_type: SWARMessageType.CardDestroy,
                action: SWARAction.CardDestroy,
                data: null,
            }),
        );
    }
}
