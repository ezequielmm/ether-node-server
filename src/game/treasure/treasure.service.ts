import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { pick } from 'lodash';
import { Socket } from 'socket.io';
import { getRandomBetween } from 'src/utils';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardTypeEnum } from '../components/card/card.enum';
import { CardService } from '../components/card/card.service';
import { stingFaeData } from '../components/enemy/data/stingFae.enemy';
import {
    ExpeditionMapNodeTypeEnum,
    IExpeditionNodeReward,
} from '../components/expedition/expedition.enum';
import { Reward } from '../components/expedition/expedition.interface';
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
import { Trapped, TreasureInterface } from './interfaces';
import { LargeChest, MediumChest, SmallChest } from './treasure.enum';

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
                    treasure,
                    nodeId,
                );
                break;
        }
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
        trappedType:
            | SmallChest.trappedType
            | MediumChest.trappedType
            | LargeChest.trappedType,
        treasure: any,
        nodeId: number,
    ) {
        const { playerState, map, id, playerId } =
            await this.expeditionService.findOne({
                clientId: client.id,
            });

        const rewards: Reward[] = [];

        const trapped: Trapped = {
            trappedType: null,
            trappedText: null,
            monster_type: null,
            damage: 0,
            curse_card: null,
        };

        const randomCoinChance = getRandomBetween(1, 100);

        if (randomCoinChance <= coinChance) {
            const coin = getRandomBetween(minCoin, maxCoin);

            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Gold,
                amount: coin,
                taken: false,
            });
        }

        const randomTrinketRarityChance = getRandomBetween(1, 100);

        let trinket = null;

        if (randomTrinketRarityChance <= trinketChanceUncommon) {
            trinket = await this.trinketService.findOneRandomTrinket(
                TrinketRarityEnum.Uncommon,
            );
        } else if (
            randomTrinketRarityChance > trinketChanceUncommon &&
            randomTrinketRarityChance <=
                trinketChanceUncommon + trinketChanceRare
        ) {
            trinket = await this.trinketService.findOneRandomTrinket(
                TrinketRarityEnum.Rare,
            );
        } else if (
            randomTrinketRarityChance >
                trinketChanceUncommon + trinketChanceRare &&
            randomTrinketRarityChance <=
                trinketChanceUncommon + trinketChanceRare + trinketChanceCommon
        ) {
            trinket = await this.trinketService.findOneRandomTrinket(
                TrinketRarityEnum.Common,
            );
        }

        if (trinket) {
            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Trinket,
                taken: false,
                trinket: pick(trinket, ['trinketId', 'name', 'description']),
            });
        }

        const randomPotionChance = getRandomBetween(1, 100);

        if (randomPotionChance <= potionChance) {
            const potion = await this.potionService.getRandomPotion();

            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Potion,
                taken: false,
                potion: pick(potion, ['potionId', 'name', 'description']),
            });
        }

        const randomTrappedChance = getRandomBetween(1, 100);

        if (randomTrappedChance <= trappedChance) {
            trapped.trappedType = trappedType;
            switch (trappedType) {
                case MediumChest.trappedType:
                    const card = await this.cardService.getRandomCardOfType(
                        CardTypeEnum.Curse,
                    );

                    playerState.cards.push({
                        id: randomUUID(),
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
                    });
                    const cardPreview = pick(card, [
                        'cardId',
                        'name',
                        'description',
                        'energy',
                        'rarity',
                        'cardType',
                        'pool',
                    ]);

                    cardPreview.description =
                        CardDescriptionFormatter.process(card);

                    trapped.trappedText = MediumChest.trappedText;

                    trapped.curse_card = cardPreview;

                    break;
                case SmallChest.trappedType:
                    playerState.hpCurrent =
                        playerState.hpCurrent - SmallChest.trappedValue;
                    trapped.damage = SmallChest.trappedValue;
                    trapped.trappedText = SmallChest.trappedText;

                    break;
                case LargeChest.trappedType:
                    trapped.trappedText = LargeChest.trappedText;
                    await this.combatEncounter(client, rewards, id);

                    return;
            }
        }

        const expeditionMap = restoreMap(map);

        const selectedNode = expeditionMap.fullCurrentMap.get(nodeId);

        selectedNode.setPrivate_data({
            treasure: { ...treasure, isOpen: true },
        });

        await this.expeditionService.updateById(id, {
            $set: {
                map: expeditionMap.getMap,
                playerState,
                'currentNode.completed': false,
                'currentNode.treasureData': {
                    trapped,
                    rewards,
                },
            },
        });

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.GenericData,
                action: SWARAction.ChestResult,
                data: { rewards, trapped },
            }),
        );

        if (trapped.damage || trapped.curse_card) {
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
    }

    generateTreasure(): TreasureInterface {
        const chance: number = getRandomBetween(1, 100);

        if (chance <= LargeChest.chance) {
            return {
                name: LargeChest.name,
                type: LargeChest.type,
                trappedType: LargeChest.trappedType,
            };
        } else if (
            chance > LargeChest.chance &&
            chance <= MediumChest.chance + LargeChest.chance
        ) {
            return {
                name: MediumChest.name,
                type: MediumChest.type,
                trappedType: MediumChest.trappedType,
            };
        } else {
            return {
                name: SmallChest.name,
                type: SmallChest.type,
                trappedType: SmallChest.trappedType,
            };
        }
    }

    async combatEncounter(client: Socket, rewards: Reward[], _id: string) {
        const { nodeId } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        const { id, act, step, exits, enter } =
            await this.expeditionService.getExpeditionMapNode({
                clientId: client.id,
                nodeId,
            });

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

        await this.expeditionService.updateById(_id, {
            $set: {
                map: expeditionMap.getMap,
                'currentNode.data': rewards,
            },
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
