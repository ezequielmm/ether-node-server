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

        if (typeof id === 'string') {
            const data = node.private_data[type];

            for (let i = 0; i < data.length; i++) {
                if (id === data[i]._id.toString()) {
                    item = data[i];
                }
            }

            if (!item) {
                client.emit('ErrorMessage', {
                    message: `Invalid id`,
                });
                return;
            }
        } else {
            item = node.private_data[type][id];

            if (!item) {
                client.emit('ErrorMessage', {
                    message: `Invalid id`,
                });
                return;
            }
        }
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });
        const { playerState, _id } = expedition || {};

        if (playerState.gold < item.coin) {
            client.emit('ErrorMessage', {
                message: `Not enough coins`,
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
        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.coin,
            cards: [...playerState.cards, item.item],
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
        const newPlayerState = {
            ...playerState,
            gold: playerState.gold - item.coin,
            potions: [...playerState.potions, item.item],
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
            let coin: number = null;

            switch (card[i].rarity) {
                case CardRarityEnum.Common:
                    coin = this.random(CardCommon.minCoin, CardCommon.maxCoin);
                    break;
                case CardRarityEnum.Uncommon:
                    coin = this.random(
                        CardUncommon.minCoin,
                        CardUncommon.maxCoin,
                    );
                    break;
                case CardRarityEnum.Rare:
                    coin = this.random(CardRare.minCoin, CardRare.maxCoin);
                    break;
            }
            cardsForPlayer.push({
                isSale: false,
                itemId: i,
                _id: card[i]._id,
                item: card[i],
                coin,
                type: ItemsTypeEnum.CardsForPlayer,
            });
        }

        const randomIndex: number = this.random(0, cardsForPlayer.length);
        cardsForPlayer[randomIndex] = {
            ...cardsForPlayer[randomIndex],
            isSale: true,
            coin: Math.floor(cardsForPlayer[randomIndex].coin / 2),
        };

        return cardsForPlayer;
    }
    async potions(): Promise<Item[]> {
        const potions = await this.potionService.randomPotion(5);
        const randomPotion: Item[] = [];
        for (let i = 0; i < potions.length; i++) {
            let coin: number = null;

            switch (potions[i].rarity) {
                case PotionRarityEnum.Common:
                    coin = this.random(
                        PotionCommon.minCoin,
                        PotionCommon.maxCoin,
                    );
                    break;
                case PotionRarityEnum.Uncommon:
                    coin = this.random(
                        PotionUncommon.minCoin,
                        PotionUncommon.maxCoin,
                    );
                    break;
                case PotionRarityEnum.Rare:
                    coin = this.random(PotionRare.minCoin, PotionRare.maxCoin);
                    break;
            }
            randomPotion.push({
                itemId: i,
                _id: potions[i]._id,
                item: potions[i],
                coin,
                type: ItemsTypeEnum.RandomPotions,
            });
        }
        return randomPotion;
    }
    async trinket(): Promise<Item[]> {
        const trinket = await this.trinketService.randomTrinket(5);
        const randomTrinket: Item[] = [];
        for (let i = 0; i < trinket.length; i++) {
            let coin: number = null;

            switch (trinket[i].rarity) {
                case TrinketRarityEnum.Common:
                    coin = this.random(
                        TrinketCommon.minCoin,
                        TrinketCommon.maxCoin,
                    );

                    break;
                case TrinketRarityEnum.Uncommon:
                    coin = this.random(
                        TrinketUncommon.minCoin,
                        TrinketUncommon.maxCoin,
                    );

                    break;
                case TrinketRarityEnum.Rare:
                    coin = this.random(
                        TrinketRare.minCoin,
                        TrinketRare.maxCoin,
                    );
                    break;
            }
            randomTrinket.push({
                itemId: i,
                _id: trinket[i]._id,
                item: trinket[i],
                coin,
                type: ItemsTypeEnum.RandomTrinkets,
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
}
