import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { getRandomBetween } from 'src/utils';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { Card } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';
import { getCardIdField } from '../components/card/card.type';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import {
    IExpeditionPlayerStateDeckCard,
} from '../components/expedition/expedition.interface';
import { Player } from "../components/expedition/player";
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { PotionService } from '../components/potion/potion.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import {
    PotionCommon,
    PotionUncommon,
    PotionRare,
    ItemsTypeEnum,
    CardCommon,
    CardRare,
    CardUncommon,
    PurchaseFailureEnum,
} from './merchant.enum';
import { Item, MerchantItems, SelectedItem } from './merchant.interface';
import mongoose from 'mongoose';

@Injectable()
export class MerchantService {
    private readonly logger: Logger = new Logger(MerchantService.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
    ) { }

    private client: Socket;
    private selectedItem: SelectedItem;
    private expeditionId: string;

    async generateMerchant(): Promise<MerchantItems> {
        const potions = await this.getPotions();
        const cards = await this.getCards();

        return {
            cards,
            potions,
            trinkets: [],
        };
    }

    async buyItem(client: Socket, selectedItem: SelectedItem): Promise<void> {
        this.client = client;
        this.selectedItem = selectedItem;

        this.logger.debug(selectedItem);

        switch (selectedItem.type) {
            case ItemsTypeEnum.Card:
            case ItemsTypeEnum.Trinket:
            case ItemsTypeEnum.Potion:
                await this.processItem();
                break;
            case ItemsTypeEnum.Destroy:
                await this.cardDestroy();
                break;
            case ItemsTypeEnum.Upgrade:
                await this.cardUpgrade();
                break;
        }
    }

    private async processItem(): Promise<void> {
        const { targetId, type } = this.selectedItem;

        const expedition = await this.expeditionService.findOne({
            clientId: this.client.id,
        });

        const {
            playerState,
            currentNode: { merchantItems, nodeType },
        } = expedition;

        this.expeditionId = expedition._id.toString();

        if (nodeType !== ExpeditionMapNodeTypeEnum.Merchant) {
            this.client.emit('ErrorMessage', {
                message: `You are not in the merchant node`,
            });
            throw new CustomException(
                'You are not in the merchant node',
                ErrorBehavior.ReturnToMainMenu,
            );
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
            this.failure(PurchaseFailureEnum.InvalidId);
            throw new CustomException(
                PurchaseFailureEnum.InvalidId,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        if (playerState.gold < item.cost) {
            this.failure(PurchaseFailureEnum.NoEnoughGold);
            throw new CustomException(
                PurchaseFailureEnum.NoEnoughGold,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        switch (type) {
            case ItemsTypeEnum.Card:
                await this.handleCard(
                    merchantItems,
                    item,
                    itemIndex,
                    playerState,
                );
                break;
            case ItemsTypeEnum.Potion:
                if (playerState.potions.length > 2) {
                    this.failure(PurchaseFailureEnum.MaxPotionReached);
                    throw new CustomException(
                        PurchaseFailureEnum.MaxPotionReached,
                        ErrorBehavior.ReturnToMainMenu,
                    );
                }
                await this.handlePotions(
                    merchantItems,
                    item,
                    itemIndex,
                    playerState,
                );
                break;
        }

        await this.success();
    }

    private async getPotions(): Promise<Item[]> {
        const potions = await this.potionService.randomPotion(5);

        const itemsData: Item[] = [];

        for (const potion of potions) {
            let cost: number = null;

            switch (potion.rarity) {
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

            const itemId = randomUUID();

            itemsData.push({
                id: itemId,
                isSold: false,
                itemId: potion.potionId,
                cost,
                type: ItemsTypeEnum.Potion,
                item: {
                    potionId: potion.potionId,
                    name: potion.name,
                    rarity: potion.rarity,
                    description: potion.description,
                    effects: potion.effects,
                    usableOutsideCombat: potion.usableOutsideCombat,
                    showPointer: potion.showPointer,
                    id: itemId,
                    isActive: true,
                },
            });
        }

        return itemsData;
    }

    private async getCards(): Promise<Item[]> {
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

        const cards: Card[] = [
            ...attackCard,
            ...defenseCard,
            ...skillCard,
            ...powerCard,
        ];

        const itemsData: Item[] = [];

        for (const card of cards) {
            let cost: number = null;

            switch (card.rarity) {
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

            const itemId = randomUUID();

            itemsData.push({
                isSale: false,
                id: itemId,
                isSold: false,
                itemId: card.cardId,
                cost,
                type: ItemsTypeEnum.Card,
                item: {
                    id: itemId,
                    cardId: card.cardId,
                    name: card.name,
                    rarity: card.rarity,
                    cardType: card.cardType,
                    pool: card.pool,
                    energy: card.energy,
                    description: CardDescriptionFormatter.process(card),
                    isTemporary: false,
                    properties: card.properties,
                    keywords: card.keywords,
                    showPointer: card.showPointer,
                    isUpgraded: card.isUpgraded,
                    upgradedCardId: card.upgradedCardId,
                    isActive: true,
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

    private async failure(data: PurchaseFailureEnum): Promise<void> {
        this.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.MerchantUpdate,
                action: SWARAction.PurchaseFailure,
                data,
            }),
        );
    }

    private async success(): Promise<void> {
        const expedition = await this.expeditionService.findOne({
            clientId: this.client.id,
        });

        const { playerState, playerId } = expedition || {};

        this.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.MerchantUpdate,
                action: SWARAction.PurchaseSuccess,
                data: null,
            }),
        );

        this.client.emit(
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

    private async handleCard(
        merchantItems: MerchantItems,
        item: Item,
        itemIndex: number,
        playerState: Player,
    ) {
        const playerDoc = playerState as unknown as mongoose.Document;
        const newPlayerState = {
            ...playerDoc.toObject(),
            gold: playerState.gold - item.cost,
            cards: [...playerState.cards, item.item],
        };

        const mewMerchantItems = {
            ...merchantItems,
        };
        mewMerchantItems.cards[itemIndex].isSold = true;

        await this.expeditionService.updateById(this.expeditionId, {
            $set: {
                playerState: newPlayerState,
                'currentNode.merchantItems': mewMerchantItems,
            },
        });
    }

    async cardUpgrade() {
        const playerState = await this.expeditionService.getPlayerState({
            clientId: this.client.id,
        });

        const cardId = this.selectedItem.targetId;

        const upgradedPrice = 75 + 25 * playerState.cardUpgradeCount;

        if (playerState.gold < upgradedPrice) {
            this.client.emit('ErrorMessage', {
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
                    this.client.emit('ErrorMessage', {
                        message: `Card not in merchant offer`,
                    });
                    return;
                }
            }
        } else {
            this.client.emit('ErrorMessage', {
                message: `Card not in merchant offer`,
            });
            return;
        }
        if (!card.isUpgraded && !card.upgradedCardId) {
            this.client.emit('ErrorMessage', {
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
            isActive: true,
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
            ...playerState, //don't toObject() here
            cards: newCard,
            gold: newGold,
            cardUpgradeCount: newCardUpgradeCount,
        };

        await this.expeditionService.updateByFilter(
            { clientId: this.client.id },
            {
                $set: {
                    playerState: newPlayerState,
                },
            },
        );

        await this.success();
    }

    private async handlePotions(
        merchantItems: MerchantItems,
        item: Item,
        itemIndex: number,
        playerState: Player,
    ) {
        const playerDoc = playerState as unknown as mongoose.Document;
        const newPlayerState = {
            ...playerDoc.toObject(),
            gold: playerState.gold - item.cost,
            potions: [...playerState.potions, item.item],
        };
        const mewMerchantItems = {
            ...merchantItems,
        };
        mewMerchantItems.potions[itemIndex].isSold = true;

        await this.expeditionService.updateById(this.expeditionId, {
            $set: {
                playerState: newPlayerState,
                'currentNode.merchantItems': mewMerchantItems,
            },
        });
    }

    async cardDestroy() {
        const playerState = await this.expeditionService.getPlayerState({
            clientId: this.client.id,
        });
        const destroyPrice = 75 + 25 * playerState.cardDestroyCount;

        if (playerState.gold < destroyPrice) {
            this.client.emit('ErrorMessage', {
                message: `Not enough gold`,
            });
            return;
        }

        const card = await this.cardService.findById(
            this.selectedItem.targetId,
        );

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
            this.client.emit('ErrorMessage', {
                message: `Card not in merchant offer`,
            });
            return;
        }

        playerState.cards.splice(cardIndex, 1);
        playerState.cardDestroyCount = playerState.cardDestroyCount + 1;
        playerState.gold = playerState.gold - destroyPrice;

        await this.expeditionService.updateByFilter(
            { clientId: this.client.id },
            {
                $set: {
                    playerState,
                },
            },
        );

        await this.success();
    }
}
