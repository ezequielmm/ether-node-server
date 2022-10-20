import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { CardDocument } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { IExpeditionPlayerState } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { PotionService } from '../components/potion/potion.service';
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
                    price = this.random(
                        CardCommon.minPrice,
                        CardCommon.maxPrice,
                    );
                    break;
                case CardRarityEnum.Uncommon:
                    price = this.random(
                        CardUncommon.minPrice,
                        CardUncommon.maxPrice,
                    );
                    break;
                case CardRarityEnum.Rare:
                    price = this.random(CardRare.minPrice, CardRare.maxPrice);
                    break;
            }
            cardsForPlayer.push({
                isSale: false,
                id: card[i].cardId,
                price,
            });
        }

        const randomIndex: number = this.random(0, cardsForPlayer.length);
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
                    price = this.random(
                        PotionCommon.minPrice,
                        PotionCommon.maxPrice,
                    );
                    break;
                case PotionRarityEnum.Uncommon:
                    price = this.random(
                        PotionUncommon.minPrice,
                        PotionUncommon.maxPrice,
                    );
                    break;
                case PotionRarityEnum.Rare:
                    price = this.random(
                        PotionRare.minPrice,
                        PotionRare.maxPrice,
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
                case PotionRarityEnum.Common:
                    price = this.random(
                        TrinketCommon.minPrice,
                        TrinketCommon.maxPrice,
                    );

                    break;
                case PotionRarityEnum.Uncommon:
                    price = this.random(
                        TrinketUncommon.minPrice,
                        TrinketUncommon.maxPrice,
                    );

                    break;
                case PotionRarityEnum.Rare:
                    price = this.random(
                        TrinketRare.minPrice,
                        TrinketRare.maxPrice,
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

        const data = {
            cards: [],
            neutral_cards: [],
            trinkets: [],
            potions: [],
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
}
