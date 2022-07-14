import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import {
    CardExistsOnPlayerHandDTO,
    CreateExpeditionDTO,
    FindOneExpeditionDTO,
    GetCurrentNodeDTO,
    GetDeckCardsDTO,
    GetExpeditionMapDTO,
    GetExpeditionMapNodeDTO,
    GetPlayerStateDTO,
    playerHasAnExpeditionDTO,
    SetCombatTurnDTO,
    SetPlayerDefenseDTO,
    UpdateClientIdDTO,
    UpdateEnemiesArrayDTO,
    UpdateExpeditionDTO,
    UpdateHandPilesDTO,
    UpdatePlayerEnergyDTO,
    UpdatePlayerHealthDTO,
} from './expedition.dto';
import { ExpeditionStatusEnum } from './expedition.enum';
import {
    AllEnemiesDTO,
    EnemyDTO,
    IExpeditionCurrentNode,
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
    IExpeditionPlayerGlobalState,
    IExpeditionPlayerStateDeckCard,
    PlayerDTO,
    RandomEnemyDTO,
    TargetEntityDTO,
} from './expedition.interface';
import { generateMap, restoreMap } from 'src/game/map/app';
import { ClientId } from './expedition.type';
import { EnemyService } from '../enemy/enemy.service';
import { getRandomItemByWeight } from 'src/utils';
import {
    AttachedStatus,
    StatusesGlobalCollection,
} from 'src/game/status/interfaces';
import { CardTargetedEnum } from '../card/card.enum';
import { ExpeditionTargets } from 'src/game/effects/effects.interface';
import { EnemyId, getEnemyIdField } from '../enemy/enemy.type';
import { find } from 'lodash';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly enemyService: EnemyService,
    ) {}

    async findOne(payload: FindOneExpeditionDTO): Promise<ExpeditionDocument> {
        return await this.expedition.findOne({
            ...payload,
            status: ExpeditionStatusEnum.InProgress,
        });
    }

    async create(payload: CreateExpeditionDTO): Promise<ExpeditionDocument> {
        return await this.expedition.create(payload);
    }

    async update(
        clientId: ClientId,
        payload: UpdateExpeditionDTO,
    ): Promise<ExpeditionDocument> {
        const field = typeof clientId === 'string' ? 'clientId' : 'playerId';
        delete payload.clientId;
        return await this.expedition.findOneAndUpdate(
            {
                [field]: clientId,
                status: ExpeditionStatusEnum.InProgress,
            },
            payload,
            { new: true },
        );
    }

    async playerHasExpeditionInProgress(
        payload: playerHasAnExpeditionDTO,
    ): Promise<boolean> {
        const { clientId } = payload;

        const field = typeof clientId === 'string' ? 'clientId' : 'playerId';

        const item = await this.expedition.exists({
            [field]: clientId,
            status: ExpeditionStatusEnum.InProgress,
        });
        return item !== null;
    }

    getMap(): IExpeditionNode[] {
        const { getMap } = generateMap();
        return getMap;
    }

    async updateClientId(
        payload: UpdateClientIdDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, playerId } = payload;
        return await this.expedition.findOneAndUpdate(
            { playerId, status: ExpeditionStatusEnum.InProgress },
            { clientId },
        );
    }

    async getExpeditionMapNode(
        payload: GetExpeditionMapNodeDTO,
    ): Promise<IExpeditionNode> {
        const { clientId, nodeId } = payload;

        const { map } = await this.expedition
            .findOne({ clientId })
            .select('map')
            .lean();

        if (!map) return null;
        if (typeof clientId === 'string')
            return restoreMap(map, clientId).fullCurrentMap.get(nodeId);
    }

    async getExpeditionMap(
        payload: GetExpeditionMapDTO,
    ): Promise<IExpeditionNode[]> {
        const { map } = await this.expedition
            .findOne(payload)
            .select('map')
            .lean();

        // TODO: throw error if there is no expedition
        if (!map) return null;
        if (typeof payload.clientId === 'string')
            return restoreMap(map, payload.clientId).getMap;
    }

    async getDeckCards(
        payload: GetDeckCardsDTO,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        const {
            playerState: { cards },
        } = await this.expedition
            .findOne(payload)
            .select('playerState.cards')
            .lean();

        return cards;
    }

    async setCombatTurn(
        payload: SetCombatTurnDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, newRound, playing } = payload;
        return await this.expedition.findOneAndUpdate(
            {
                clientId,
                status: ExpeditionStatusEnum.InProgress,
            },
            {
                $set: {
                    ...(newRound !== undefined && {
                        'currentNode.data.round': newRound,
                    }),
                    'currentNode.data.playing': playing,
                },
            },
            { new: true },
        );
    }

    async getCurrentNode(
        payload: GetCurrentNodeDTO,
    ): Promise<IExpeditionCurrentNode> {
        const { clientId } = payload;
        const { currentNode } = await this.expedition
            .findOne({ clientId, status: ExpeditionStatusEnum.InProgress })
            .select('currentNode')
            .lean();
        return currentNode;
    }

    async getPlayerState(
        payload: GetPlayerStateDTO,
    ): Promise<IExpeditionPlayerGlobalState> {
        const { clientId } = payload;
        const { playerState } = await this.expedition.findOne({
            clientId,
            status: ExpeditionStatusEnum.InProgress,
        });
        return playerState;
    }

    async cardExistsOnPlayerHand(
        payload: CardExistsOnPlayerHandDTO,
    ): Promise<boolean> {
        const { cardId, clientId } = payload;

        const field = typeof clientId === 'string' ? 'clientId' : 'playerId';

        const cardIdField =
            typeof cardId === 'string'
                ? 'currentNode.data.player.cards.hand.id'
                : 'currentNode.data.player.cards.hand.cardId';

        const itemExists = await this.expedition.exists({
            [field]: clientId,
            status: ExpeditionStatusEnum.InProgress,
            [cardIdField]: cardId,
        });
        return itemExists !== null;
    }

    async updatePlayerEnergy(
        payload: UpdatePlayerEnergyDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, newEnergy } = payload;

        const field = typeof clientId === 'string' ? 'clientId' : 'playerId';

        return this.expedition.findOneAndUpdate(
            { [field]: clientId, status: ExpeditionStatusEnum.InProgress },
            { 'currentNode.data.player.energy': newEnergy },
            { new: true },
        );
    }

    async updateEnemiesArray(
        payload: UpdateEnemiesArrayDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, enemies } = payload;

        const field = typeof clientId === 'string' ? 'clientId' : 'playerId';

        return this.expedition.findOneAndUpdate(
            { [field]: clientId, status: ExpeditionStatusEnum.InProgress },
            { 'currentNode.data.enemies': enemies },
            { new: true },
        );
    }

    async updateHandPiles(
        payload: UpdateHandPilesDTO,
    ): Promise<ExpeditionDocument> {
        const { hand, exhausted, clientId, draw, discard } = payload;

        const field = typeof clientId === 'string' ? 'clientId' : 'playerId';

        const piles = {
            ...(hand && { 'currentNode.data.player.cards.hand': hand }),
            ...(exhausted && {
                'currentNode.data.player.cards.exhausted': exhausted,
            }),
            ...(draw && {
                'currentNode.data.player.cards.draw': draw,
            }),
            ...(discard && {
                'currentNode.data.player.cards.discard': discard,
            }),
        };

        return this.expedition.findOneAndUpdate(
            { [field]: clientId, status: ExpeditionStatusEnum.InProgress },
            piles,
            { new: true },
        );
    }

    async setPlayerDefense(
        payload: SetPlayerDefenseDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, value } = payload;

        const {
            data: {
                player: { defense },
            },
        } = await this.getCurrentNode({ clientId: clientId });

        const newDefenseValue = defense + value;

        return await this.expedition.findOneAndUpdate(
            {
                clientId,
                status: ExpeditionStatusEnum.InProgress,
            },
            { 'currentNode.data.player.defense': newDefenseValue },
            { new: true },
        );
    }

    async setPlayerHealth(
        payload: UpdatePlayerHealthDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, hpCurrent } = payload;

        const field = typeof clientId === 'string' ? 'clientId' : 'playerId';

        return this.expedition.findOneAndUpdate(
            {
                [field]: clientId,
                status: ExpeditionStatusEnum.InProgress,
            },
            { 'playerState.hpCurrent': hpCurrent },
            { new: true },
        );
    }

    async calculateNewEnemyIntentions(
        clientId: string,
    ): Promise<IExpeditionCurrentNodeDataEnemy[]> {
        const {
            data: { enemies },
        } = await this.getCurrentNode({ clientId });

        for (const enemy of enemies) {
            const { scripts } = await this.enemyService.findById(enemy.id);
            const currentScript = enemy.currentScript;

            if (!currentScript) {
                enemy.currentScript = scripts[0];
                continue;
            }

            const nextScript =
                scripts[
                    getRandomItemByWeight(
                        currentScript.next,
                        currentScript.next.map((s) => s.probability),
                    ).scriptIndex
                ];

            enemy.currentScript = nextScript;
        }

        await this.updateEnemiesArray({
            clientId,
            enemies,
        });

        return enemies;
    }

    async findAllStatuses(
        expedition: Expedition,
    ): Promise<StatusesGlobalCollection> {
        const statuses: {
            target: TargetEntityDTO;
            statuses: AttachedStatus[];
        }[] = [];

        statuses.push({
            target: {
                type: CardTargetedEnum.Player,
                value: {
                    globalState: expedition.playerState,
                    combatState: expedition.currentNode.data.player,
                },
            },
            statuses: [
                ...expedition.currentNode.data.player.statuses.buff,
                ...expedition.currentNode.data.player.statuses.debuff,
            ],
        });

        for (const enemy of expedition.currentNode.data.enemies) {
            statuses.push({
                target: {
                    type: CardTargetedEnum.Enemy,
                    value: enemy,
                },
                statuses: [...enemy.statuses.buff, ...enemy.statuses.debuff],
            });
        }

        return statuses;
    }

    public async findTargets(
        expedition: Expedition,
        enemyId?: EnemyId,
    ): Promise<ExpeditionTargets> {
        const {
            playerState: globalState,
            currentNode: {
                data: { player: combatState, enemies },
            },
        } = expedition;

        const player: PlayerDTO = {
            type: CardTargetedEnum.Player,
            value: {
                globalState,
                combatState,
            },
        };

        const selectedEnemy: EnemyDTO = enemyId && {
            type: CardTargetedEnum.Enemy,
            value: find(enemies, [getEnemyIdField(enemyId), enemyId]),
        };

        const randomEnemy: RandomEnemyDTO = {
            type: CardTargetedEnum.RandomEnemy,
            value: enemies[Math.floor(Math.random() * enemies.length)],
        };

        const allEnemies: AllEnemiesDTO = {
            type: CardTargetedEnum.AllEnemies,
            value: enemies,
        };

        return {
            player,
            randomEnemy,
            allEnemies,
            selectedEnemy,
        };
    }
}
