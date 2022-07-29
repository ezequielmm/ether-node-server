import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
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
    IExpeditionCurrentNode,
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
    IExpeditionPlayerGlobalState,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';
import { generateMap, restoreMap } from 'src/game/map/app';
import { ClientId, getClientIdField } from './expedition.type';
import { EnemyService } from '../enemy/enemy.service';
import { getRandomItemByWeight } from 'src/utils';
import { EnemyId, getEnemyIdField } from '../enemy/enemy.type';
import { EffectService } from 'src/game/effects/effects.service';
import { CardTargetedEnum } from '../card/card.enum';
import { sample } from 'lodash';
import { Socket } from 'socket.io';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly enemyService: EnemyService,
        private readonly effectService: EffectService,
    ) {}

    async findOne(payload: FindOneExpeditionDTO): Promise<Expedition> {
        const expedition = await this.expedition
            .findOne({
                ...payload,
                status: ExpeditionStatusEnum.InProgress,
            })
            .lean();

        return this.syncCardDescriptions(expedition);
    }

    async syncCardDescriptions(expedition: Expedition): Promise<Expedition> {
        const cards = expedition.currentNode?.data?.player?.cards?.hand;

        if (!cards) return expedition;

        for (const card of cards) {
            for (const jsonEffect of card.properties.effects) {
                const { effect: name, args } = jsonEffect;

                const dto = await this.effectService.preview({
                    client: {} as Socket,
                    expedition,
                    dto: {
                        client: {} as Socket,
                        expedition,
                        source: {
                            type: CardTargetedEnum.Player,
                            value: {
                                globalState: expedition.playerState,
                                combatState: expedition.currentNode.data.player,
                            },
                        },
                        target: {
                            type: CardTargetedEnum.Enemy,
                            value: sample(
                                expedition.currentNode?.data?.enemies,
                            ),
                        },
                        args: {
                            initialValue: args.value,
                            currentValue: args.value,
                        },
                    },
                    effect: name,
                });
                card.description = card.description.replace(
                    `{${name}}`,
                    dto.args.currentValue.toString(),
                );
            }
        }

        return this.expedition
            .findOneAndUpdate(
                {
                    clientId: expedition.clientId,
                },
                {
                    'currentNode.data.player.cards.hand': cards,
                },
            )
            .lean();
    }

    async create(payload: CreateExpeditionDTO): Promise<ExpeditionDocument> {
        return await this.expedition.create(payload);
    }

    /**
     * Update the expedition using ObjectId
     *
     * @param id The id of the expedition
     * @param query Expedition query
     * @returns If the expedition was updated
     */
    async updateById(
        id: any,
        query: UpdateQuery<ExpeditionDocument>,
    ): Promise<boolean> {
        // Using udpateOne to save a bit of time and bandwidth
        // it is not necessary to return the updated document
        const response = await this.expedition.updateOne(
            {
                _id: id,
            },
            query,
            {
                new: true,
            },
        );

        // Return if expedition was updated
        return response.modifiedCount > 0;
    }

    async update(
        clientId: ClientId,
        payload: UpdateExpeditionDTO,
    ): Promise<ExpeditionDocument> {
        const clientField = getClientIdField(clientId);

        delete payload.clientId;

        return await this.expedition.findOneAndUpdate(
            {
                [clientField]: clientId,
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

        const clientField = getClientIdField(clientId);

        const item = await this.expedition.exists({
            [clientField]: clientId,
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
        const expedition = await this.findOne(payload);
        return expedition.currentNode;
    }

    /** @deprecated Use PlayerService.getPlayer instead */
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

        const clientField = getClientIdField(clientId);

        const cardIdField =
            typeof cardId === 'string'
                ? 'currentNode.data.player.cards.hand.id'
                : 'currentNode.data.player.cards.hand.cardId';

        const itemExists = await this.expedition.exists({
            [clientField]: clientId,
            status: ExpeditionStatusEnum.InProgress,
            [cardIdField]: cardId,
        });
        return itemExists !== null;
    }

    /** @deprecated Use PlayerService.energy instead */
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

    async updateHandPiles(payload: UpdateHandPilesDTO): Promise<Expedition> {
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

        const expedition = await this.expedition
            .findOneAndUpdate(
                { [field]: clientId, status: ExpeditionStatusEnum.InProgress },
                piles,
                { new: true },
            )
            .lean();

        return this.syncCardDescriptions(expedition);
    }

    /** @deprecated Use PlayerService.defense instead */
    async setPlayerDefense(
        payload: SetPlayerDefenseDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, value } = payload;

        const clientField = getClientIdField(clientId);

        return await this.expedition.findOneAndUpdate(
            {
                [clientField]: clientId,
                status: ExpeditionStatusEnum.InProgress,
            },
            { 'currentNode.data.player.defense': value },
            { new: true },
        );
    }

    async setEnemyDefense(
        clientId: string,
        enemyId: EnemyId,
        defense: number,
    ): Promise<ExpeditionDocument> {
        const clientField = getClientIdField(clientId);

        return this.expedition.findOneAndUpdate(
            {
                [clientField]: clientId,
                status: ExpeditionStatusEnum.InProgress,
                [`currentNode.data.enemies.${getEnemyIdField(enemyId)}`]:
                    enemyId,
            },
            {
                'currentNode.data.enemies.$.defense': defense,
            },
        );
    }

    /** @deprecated Use PlayerService.heal instead */
    async setPlayerHealth(
        payload: UpdatePlayerHealthDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, hpCurrent } = payload;

        const clientField = getClientIdField(clientId);

        return this.expedition.findOneAndUpdate(
            {
                [clientField]: clientId,
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
}
