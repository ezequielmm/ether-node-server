import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { getRandomBetween } from 'src/utils';
import { CardTypeEnum } from '../components/card/card.enum';
import { CardService } from '../components/card/card.service';
import { stingFaeData } from '../components/enemy/data/stingFae.enemy';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionService } from '../components/potion/potion.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { TrinketService } from '../components/trinket/trinket.service';
import { restoreMap } from '../map/app';
import nodeFactory from '../map/nodes';
import { InitCombatProcess } from '../process/initCombat.process';
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
} from './treasure.enum';

@Injectable()
export class TreasureService {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly trinketService: TrinketService,
        private readonly potionService: PotionService,
        private readonly cardService: CardService,
        private readonly initCombatProcess: InitCombatProcess,
    ) {}

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
                    treasure,
                    nodeId,
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
                    treasure,
                    nodeId,
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
                    treasure,
                    nodeId,
                );
                break;
        }

        const { playerState, playerId } = await this.expeditionService.findOne({
            clientId: client.id,
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
        treasure: any,
        nodeId: number,
    ) {
        const result = {
            coin: 0,
            trinket: null,
            potion: null,
            trappedType: null,
            trappedText: null,
        };
        const randomCoinChance = getRandomBetween(1, 100);

        if (randomCoinChance <= coinChance) {
            result.coin = getRandomBetween(minCoin, maxCoin);
        }

        const randomTrinketRarityChance = getRandomBetween(1, 100);

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

        const randomPotionChance = getRandomBetween(1, 100);

        if (randomPotionChance <= potionChance) {
            result.potion = await this.potionService.getRandomPotion();
        }
        const { playerState } = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const newPlayerState = {
            ...playerState,
            gold: playerState.gold + result.coin,
        };
        const newPrivateData = { ...treasure, isOpen: true };

        if (result.potion) {
            newPlayerState.potions.push(result.potion);
        }
        const randomTrappedChance = getRandomBetween(1, 100);

        if (randomTrappedChance <= trappedChance) {
            result.trappedText = trappedText;
            result.trappedType = trappedType;
            newPrivateData.trappedType = trappedType;
            if (trappedType === TrappedType.CurseCard) {
                const card: any = await this.cardService.getRandomCardOfType(
                    CardTypeEnum.Curse,
                );
                if (card) newPlayerState.cards.push(card);
            } else if (trappedType === TrappedType.Damage) {
                newPlayerState.hpCurrent = playerState.hpCurrent - trappedValue;
            }
        }

        const map = await this.expeditionService.getExpeditionMap({
            clientId: client.id,
        });
        const expeditionMap = restoreMap(map);

        const selectedNode = expeditionMap.fullCurrentMap.get(nodeId);

        selectedNode.setPrivate_data({
            treasure: newPrivateData,
        });

        await this.expeditionService.update(client.id, {
            map: expeditionMap.getMap,
            playerState: newPlayerState,
        });

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.GenericData,
                action: SWARAction.ChestResult,
                data: result,
            }),
        );
    }

    generateTreasure(): TreasureInterface {
        const chance: number = getRandomBetween(1, 100);

        if (chance <= LargeChest.chance) {
            return {
                name: LargeChest.name,
                type: LargeChest.type,
                isOpen: false,
                trappedType: null,
            };
        } else if (
            chance > LargeChest.chance &&
            chance <= MediumChest.chance + LargeChest.chance
        ) {
            return {
                name: MediumChest.name,
                type: MediumChest.type,
                isOpen: false,
                trappedType: null,
            };
        } else {
            return {
                name: SmallChest.name,
                type: SmallChest.type,
                isOpen: false,
                trappedType: null,
            };
        }
    }
    async combatEncounter(client: Socket) {
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

        const { id, act, step, exits, enter, private_data } =
            await this.expeditionService.getExpeditionMapNode({
                clientId: client.id,
                nodeId,
            });

        if (private_data.treasure.trappedType !== TrappedType.Node) {
            client.emit('ErrorMessage', {
                message: `Wrong event state`,
            });
            return;
        }
        const newNode = nodeFactory(
            id,
            act,
            step,
            ExpeditionMapNodeTypeEnum.Combat,
            ExpeditionMapNodeTypeEnum.CombatStandard,
            {
                enemies: [
                    {
                        enemies: [stingFaeData.enemyId, stingFaeData.enemyId],
                        probability: 1,
                    },
                ],
            },
        );

        newNode.exits = exits;
        newNode.enter = enter;

        const map = await this.expeditionService.getExpeditionMap({
            clientId: client.id,
        });
        const expeditionMap = restoreMap(map);
        expeditionMap.fullCurrentMap.set(id, newNode);

        const selectedNode = expeditionMap.fullCurrentMap.get(id);
        selectedNode.select(expeditionMap);

        await this.expeditionService.update(client.id, {
            map: expeditionMap.getMap,
        });
        const node = await this.expeditionService.getExpeditionMapNode({
            clientId: client.id,
            nodeId: id,
        });
        await this.initCombatProcess.process(client, node);

        client.emit(
            'InitCombat',
            StandardResponse.respond({
                message_type: SWARMessageType.CombatUpdate,
                action: SWARAction.BeginCombat,
                data: null,
            }),
        );
    }
}
