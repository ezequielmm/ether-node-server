import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CardTypeEnum } from '../components/card/card.enum';
import { CardService } from '../components/card/card.service';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionService } from '../components/potion/potion.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { TrinketService } from '../components/trinket/trinket.service';
import { restoreMap } from '../map/app';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { TreasureInterface } from './interfaces';
import {
    LargeChest,
    MediumChest,
    SmallChest,
    TrappedType,
} from './Treasure.enum';

@Injectable()
export class TreasureService {
    private readonly logger = new Logger(TreasureService.name);
    constructor(
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => TrinketService))
        private readonly trinketService: TrinketService,
        private readonly potionService: PotionService,
        @Inject(forwardRef(() => CardService))
        private readonly cardService: CardService,
    ) {}

    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    async handle(client: Socket) {
        const { nodeId, nodeType } =
            await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

        if (nodeType !== ExpeditionMapNodeTypeEnum.Treasure) {
            client.emit('ErrorMessage', {
                message: `You are not in the treasure node`,
            });
            return;
        }
        const {
            private_data: { treasure },
        } = await this.expeditionService.getExpeditionMapNode({
            clientId: client.id,
            nodeId,
        });
        if (treasure.isOpen) {
            client.emit('ErrorMessage', {
                message: `you have already opened chest`,
            });
            return;
        }
        switch (treasure.type) {
            case LargeChest.type:
                await this.handChest(
                    LargeChest.coinChance,
                    LargeChest.maxCoin,
                    LargeChest.minCoin,
                    LargeChest.trinketChanceUncommon,
                    LargeChest.trinketChanceRare,
                    LargeChest.trinketChanceCommon,
                    LargeChest.potionChance,
                    client,
                    LargeChest.trappedChance,
                    LargeChest.trappedType,
                    LargeChest.trappedValue,
                    LargeChest.trappedText,
                );
                break;
            case MediumChest.type:
                await this.handChest(
                    MediumChest.coinChance,
                    MediumChest.maxCoin,
                    MediumChest.minCoin,
                    MediumChest.trinketChanceUncommon,
                    MediumChest.trinketChanceRare,
                    MediumChest.trinketChanceCommon,
                    MediumChest.potionChance,
                    client,
                    MediumChest.trappedChance,
                    MediumChest.trappedType,
                    MediumChest.trappedValue,
                    MediumChest.trappedText,
                );
                break;
            case SmallChest.type:
                await this.handChest(
                    SmallChest.coinChance,
                    SmallChest.maxCoin,
                    SmallChest.minCoin,
                    SmallChest.trinketChanceUncommon,
                    SmallChest.trinketChanceRare,
                    SmallChest.trinketChanceCommon,
                    SmallChest.potionChance,
                    client,
                    SmallChest.trappedChance,
                    SmallChest.trappedType,
                    SmallChest.trappedValue,
                    SmallChest.trappedText,
                );
                break;
        }

        const { playerState, playerId } = await this.expeditionService.findOne({
            clientId: client.id,
        });
        const map = await this.expeditionService.getExpeditionMap({
            clientId: client.id,
        });
        const expeditionMap = restoreMap(map);

        const selectedNode = expeditionMap.fullCurrentMap.get(nodeId);

        selectedNode.setPrivate_data({
            treasure: { ...treasure, isOpen: true },
        });

        await this.expeditionService.update(client.id, {
            map: expeditionMap.getMap,
        });

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
    async handChest(
        coinChance: number,
        maxCoin: number,
        minCoin: number,
        trinketChanceUncommon: number,
        trinketChanceRare: number,
        trinketChanceCommon: number,
        potionChance: number,
        client: Socket,
        trappedChance: number,
        trappedType: string,
        trappedValue: number,
        trappedText: string,
    ) {
        const result = {
            coin: 0,
            trinket: null,
            potion: null,
            trapped: {
                trappedType: null,
                trappedText: null,
            },
        };
        const randomCoinChance = this.random(1, 100);

        if (randomCoinChance <= coinChance) {
            result.coin = this.random(minCoin, maxCoin);
        }

        const randomTrinketRarityChance = this.random(1, 100);

        if (randomTrinketRarityChance <= trinketChanceUncommon) {
            result.trinket = await this.trinketService.findOneRandomTrinket(
                TrinketRarityEnum.Uncommon,
            );
        } else if (
            randomTrinketRarityChance > trinketChanceUncommon &&
            randomTrinketRarityChance <=
                trinketChanceUncommon + trinketChanceRare
        ) {
            result.trinket = await this.trinketService.findOneRandomTrinket(
                TrinketRarityEnum.Rare,
            );
        } else if (
            randomTrinketRarityChance >
                trinketChanceUncommon + trinketChanceRare &&
            randomTrinketRarityChance <=
                trinketChanceUncommon + trinketChanceRare + trinketChanceCommon
        ) {
            result.trinket = await this.trinketService.findOneRandomTrinket(
                TrinketRarityEnum.Common,
            );
        }

        const randomPotionChance = this.random(1, 100);

        if (randomPotionChance <= potionChance) {
            result.potion = await this.potionService.getRandomPotion();
        }
        const { _id, playerState } = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const newPlayerState = {
            ...playerState,
            gold: playerState.gold + result.coin,
        };
        if (result.potion) {
            newPlayerState.potions.push(result.potion);
        }
        const randomTrappedChance = this.random(1, 100);

        if (randomTrappedChance <= trappedChance) {
            if (trappedType === TrappedType.CurseCard) {
                result.trapped.trappedText = trappedText;
                result.trapped.trappedType = trappedType;
                const card: any = await this.cardService.getRandomCardOfType(
                    CardTypeEnum.Curse,
                );
                newPlayerState.cards.push(card);
            } else if (trappedType === TrappedType.Damage) {
                result.trapped.trappedText = trappedText;
                result.trapped.trappedType = trappedType;
                newPlayerState.hpCurrent = playerState.hpCurrent - trappedValue;
            }
        }

        await this.expeditionService.updateById(_id, {
            $set: {
                playerState: newPlayerState,
            },
        });
        client.emit(
            'OpenChest',
            StandardResponse.respond({
                message_type: SWARMessageType.OpenTreasure,
                action: SWARAction.OpenTreasure,
                data: result,
            }),
        );
    }

    generateTreasure(): TreasureInterface {
        const chance: number = this.random(1, 100);

        if (chance <= LargeChest.chance) {
            return {
                name: LargeChest.name,
                type: LargeChest.type,
                isOpen: false,
            };
        } else if (
            chance > LargeChest.chance &&
            chance <= MediumChest.chance + LargeChest.chance
        ) {
            return {
                name: MediumChest.name,
                type: MediumChest.type,
                isOpen: false,
            };
        } else {
            return {
                name: SmallChest.name,
                type: SmallChest.type,
                isOpen: false,
            };
        }
    }
}
