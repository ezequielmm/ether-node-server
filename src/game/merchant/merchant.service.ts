import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { getRandomBetween } from 'src/utils';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { Card } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';
import { NodeType } from '../components/expedition/node-type';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { Player } from '../components/expedition/player';
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
    TrinketCommon,
    TrinketUncommon,
    TrinketRare,
} from './merchant.enum';
import { Item, MerchantItems, SelectedItem } from './merchant.interface';
import mongoose from 'mongoose';
import { TrinketService } from '../components/trinket/trinket.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { GameContext } from '../components/interfaces';
import { filter, find } from 'lodash';
import { Node } from '../components/expedition/node';
import { Trinket } from '../components/trinket/trinket.schema';
import { map } from 'lodash';

@Injectable()
export class MerchantService {
    private readonly logger: Logger = new Logger(MerchantService.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
        private readonly trinketService: TrinketService,
    ) {}

    async generateMerchant(
        ctx?: GameContext | null,
        node?: Node,
    ): Promise<MerchantItems> {
        const cards = node?.private_data?.cards || await this.getCards();
        const potions = node?.private_data?.potions || await this.getPotions();
        let trinkets = node?.private_data?.trinkets || await this.getTrinkets();

        const result: MerchantItems = {
            cards,
            potions,
            trinkets
        };
        
        if (ctx) {
            const trinketsInInventory = map<Trinket>(
                ctx.expedition.playerState.trinkets,
                'trinketId',
            );
    
            trinkets = trinkets.map(function (trinket) {
                if (trinketsInInventory.includes(trinket.itemId)) {
                    trinket.isSold = true;
                    trinket.cost =
                        trinket.cost < ctx.expedition.playerState.gold
                            ? ctx.expedition.playerState.gold *
                              (1 + Math.random() / 3)
                            : trinket.cost;
                }
                return trinket;
            });

            result.destroyCost = this.cardDestroyPrice(ctx.expedition.playerState.cardDestroyCount);
            result.upgradeCost = this.cardUpgradePrice(ctx.expedition.playerState.cardUpgradeCount);
        }
        
        return result;
    }

    async buyItem(ctx: GameContext, selectedItem: SelectedItem): Promise<void> {
        this.logger.log(ctx.info, selectedItem);

        switch (selectedItem.type) {
            case ItemsTypeEnum.Card:
            case ItemsTypeEnum.Trinket:
            case ItemsTypeEnum.Potion:
                await this.processItem(ctx.client, selectedItem);
                break;
            case ItemsTypeEnum.Destroy:
                await this.cardDestroy(ctx.client, selectedItem);
                break;
            case ItemsTypeEnum.Upgrade:
                await this.cardUpgrade(ctx.client, selectedItem);
                break;
        }
    }

    private async processItem(
        client: Socket,
        selectedItem: SelectedItem,
    ): Promise<void> {
        const { targetId, type } = selectedItem;

        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const {
            playerState,
            currentNode: { merchantItems, nodeType },
        } = expedition;

        if (nodeType !== NodeType.Merchant) {
            client.emit('ErrorMessage', {
                message: `You are not in the merchant node`,
            });
            throw new CustomException(
                'You are not in the merchant node',
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        let item: Item;
        let itemIndex: number;
        let items: Item[] = [];

        switch (type) {
            case ItemsTypeEnum.Card:
                items = merchantItems.cards;
                break;
            case ItemsTypeEnum.Trinket:
                items = merchantItems.trinkets;
                break;
            case ItemsTypeEnum.Potion:
                items = merchantItems.potions;
                break;
        }

        items.forEach((element, i) => {
            switch (typeof targetId) {
                case 'string':
                    if (targetId === element.id) {
                        item = element;
                        itemIndex = i;
                    }
                    break;
                case 'number':
                    if (targetId === element.itemId) {
                        item = element;
                        itemIndex = i;
                    }
                    break;
            }
        });

        if (!item) {
            this.failure(client, PurchaseFailureEnum.InvalidId);
            throw new CustomException(
                PurchaseFailureEnum.InvalidId,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        if (playerState.gold < item.cost) {
            this.failure(client, PurchaseFailureEnum.NoEnoughGold);
            throw new CustomException(
                PurchaseFailureEnum.NoEnoughGold,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        switch (type) {
            case ItemsTypeEnum.Card:
                await this.handleCard(
                    client,
                    merchantItems,
                    item,
                    itemIndex,
                    playerState,
                );
                break;
            case ItemsTypeEnum.Potion:
                if (playerState.potions.length > 2) {
                    this.failure(client, PurchaseFailureEnum.MaxPotionReached);
                    throw new CustomException(
                        PurchaseFailureEnum.MaxPotionReached,
                        ErrorBehavior.ReturnToMainMenu,
                    );
                }
                await this.handlePotions(
                    client,
                    merchantItems,
                    item,
                    itemIndex,
                    playerState,
                );
                break;
            case ItemsTypeEnum.Trinket:
                await this.handleTrinkets(
                    client,
                    merchantItems,
                    item,
                    itemIndex,
                    playerState,
                );
                break;
        }

        await this.success(client);
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

    private async getTrinkets(): Promise<Item[]> {
        const trinkets = this.trinketService.getRandomTrinkets(5, (trinket) => {
            // Avoid special trinkets
            return trinket.rarity !== TrinketRarityEnum.Special;
        });

        const itemsData: Item[] = [];

        for (const trinket of trinkets) {
            let cost: number = null;

            switch (trinket.rarity) {
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

            const itemId = randomUUID();

            trinket.id = itemId;

            itemsData.push({
                id: itemId,
                isSold: false,
                itemId: trinket.trinketId,
                cost,
                type: ItemsTypeEnum.Trinket,
                item: trinket,
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
            let cost = 0;

            switch (card.rarity) {
                case CardRarityEnum.Common:
                    cost = this.getCardPrice(
                        CardCommon.minPrice,
                        CardCommon.maxPrice,
                        card.isUpgraded,
                    );
                    break;
                case CardRarityEnum.Uncommon:
                    cost = this.getCardPrice(
                        CardUncommon.minPrice,
                        CardUncommon.maxPrice,
                        card.isUpgraded,
                    );
                    break;
                case CardRarityEnum.Rare:
                    cost = this.getCardPrice(
                        CardRare.minPrice,
                        CardRare.maxPrice,
                        card.isUpgraded,
                    );
                    break;
            }

            card.description = CardDescriptionFormatter.process(card);
            this.cardService.addStatusDescriptions(card);

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
                    description: card.description,
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

        const randomIndex: number = getRandomBetween(0, itemsData.length - 1);

        itemsData[randomIndex] = {
            ...itemsData[randomIndex],
            isSale: true,
            cost: Math.floor(itemsData[randomIndex].cost / 2),
        };

        return itemsData;
    }

    private getCardPrice(
        minPrice: number,
        maxPrice: number,
        isCardUpgraded: boolean,
    ): number {
        const priceIncrease = isCardUpgraded ? maxPrice - minPrice : 0;
        return getRandomBetween(minPrice, maxPrice) + priceIncrease;
    }

    private async failure(
        client: Socket,
        data: PurchaseFailureEnum,
    ): Promise<void> {
        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.MerchantUpdate,
                action: SWARAction.PurchaseFailure,
                data,
            }),
        );
    }

    private async success(client: Socket): Promise<void> {
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const { playerState, playerId } = expedition || {};

        client.emit(
            'PutData',
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

    private async handleCard(
        client: Socket,
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

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    playerState: newPlayerState,
                    'currentNode.merchantItems': mewMerchantItems,
                },
            },
        );
    }

    cardUpgradePrice(cardUpgradeCount: number): number {
        return 75 + 25 * cardUpgradeCount;
    }

    async cardUpgrade(
        client: Socket,
        selectedItem: SelectedItem,
    ): Promise<void> {
        // First we need to get the player state with the card data
        const playerState = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });

        // Now we get the card id from the selected item
        const cardId = selectedItem.targetId as string;

        // Now we need the price to upgrade the card
        const upgradedPrice = this.cardUpgradePrice(playerState.cardUpgradeCount);

        // Now we need to check if the player has enough gold
        if (playerState.gold < upgradedPrice)
            return this.failure(client, PurchaseFailureEnum.NoEnoughGold);

        // Now we find the card in the player state to get its card id
        const cardFromPlayerState = find(
            playerState.cards,
            ({ id }) => id === cardId,
        );

        // If we can't find the card we return an error
        if (!cardFromPlayerState)
            return this.failure(client, PurchaseFailureEnum.InvalidId);

        // Now we query the card information to check if we can upgrade it
        const card = await this.cardService.findOne({
            cardId: cardFromPlayerState.cardId,
        });

        // If we can't find the card we return an error
        if (!card) return this.failure(client, PurchaseFailureEnum.InvalidId);

        // Now we check if the card is already upgraded
        if (card.isUpgraded && !card.upgradedCardId)
            return this.failure(
                client,
                PurchaseFailureEnum.CardAlreadyUpgraded,
            );

        // Now we check if the card is a status card, this ones can't be upgraded
        if (card.cardType === CardTypeEnum.Status)
            return this.failure(client, PurchaseFailureEnum.CardCantBeUpgraded);

        // Now we query the upgraded information of the card
        const upgradedCardData = await this.cardService.findOne({
            cardId: card.upgradedCardId,
        });

        if (!upgradedCardData)
            return this.failure(client, PurchaseFailureEnum.InvalidId);

        upgradedCardData.description = CardDescriptionFormatter.process(upgradedCardData);
        this.cardService.addStatusDescriptions(upgradedCardData);

        // Here we create the card object to be added to the player state
        const upgradedCard: IExpeditionPlayerStateDeckCard = {
            id: randomUUID(),
            cardId: upgradedCardData.cardId,
            name: upgradedCardData.name,
            cardType: upgradedCardData.cardType,
            energy: upgradedCardData.energy,
            description: upgradedCardData.description,
            isTemporary: false,
            rarity: upgradedCardData.rarity,
            properties: upgradedCardData.properties,
            keywords: upgradedCardData.keywords,
            showPointer: upgradedCardData.showPointer,
            pool: upgradedCardData.pool,
            isUpgraded: upgradedCardData.isUpgraded,
            isActive: true,
        };

        // Now we need to remove the old card from the player state
        const newCardDeck = filter(
            playerState.cards,
            ({ id }) => id !== cardId,
        );

        // Now we add the new card to the player state
        newCardDeck.push(upgradedCard);

        // Now we reduce the coin cost of the upgrade
        const newGold = playerState.gold - upgradedPrice;

        // Now we increase the card upgrade count
        const newCardUpgradeCount = playerState.cardUpgradeCount + 1;

        // Now we update the player state
        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    'playerState.cards': newCardDeck,
                    'playerState.gold': newGold,
                    'playerState.cardUpgradeCount': newCardUpgradeCount,
                },
            },
        );

        await this.success(client);
    }

    private async handlePotions(
        client: Socket,
        merchantItems: MerchantItems,
        item: Item,
        itemIndex: number,
        playerState: Player,
    ): Promise<void> {
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

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    playerState: newPlayerState,
                    'currentNode.merchantItems': mewMerchantItems,
                },
            },
        );
    }

    private async handleTrinkets(
        client: Socket,
        merchantItems: MerchantItems,
        item: Item,
        itemIndex: number,
        playerState: Player,
    ): Promise<void> {
        const playerDoc = playerState as unknown as mongoose.Document;
        const newPlayerState = {
            ...playerDoc.toObject(),
            gold: playerState.gold - item.cost,
            trinkets: [...playerState.trinkets, item.item],
        };

        const mewMerchantItems = {
            ...merchantItems,
        };
        mewMerchantItems.trinkets[itemIndex].isSold = true;

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    playerState: newPlayerState,
                    'currentNode.merchantItems': mewMerchantItems,
                },
            },
        );
    }

    cardDestroyPrice(cardDestroyCount: number): number {
        return 75 + 25 * cardDestroyCount;
    }

    async cardDestroy(
        client: Socket,
        selectedItem: SelectedItem,
    ): Promise<void> {
        // First we need to get the player state with the card data
        const playerState = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });

        // Now we get the card id from the selected item
        const cardId = selectedItem.targetId as string;

        // Now we need the price to destroy the card
        const destroyPrice = this.cardDestroyPrice(playerState.cardDestroyCount);

        // Now we need to check if the player has enough gold
        if (playerState.gold < destroyPrice)
            return this.failure(client, PurchaseFailureEnum.NoEnoughGold);

        // Now we find the card in the player state and remove it
        const newCardDeck = filter(
            playerState.cards,
            ({ id }) => id !== cardId,
        );

        // Now we reduce the coin cost of the upgrade
        const newGold = playerState.gold - destroyPrice;

        // Now we increase the card destroy count
        const newCardDestroyCount = playerState.cardDestroyCount + 1;

        // Now we update the player state
        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                $set: {
                    'playerState.cards': newCardDeck,
                    'playerState.gold': newGold,
                    'playerState.cardDestroyCount': newCardDestroyCount,
                },
            },
        );

        await this.success(client);
    }
}
