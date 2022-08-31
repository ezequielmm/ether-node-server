import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery, FilterQuery } from 'mongoose';
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
    UpdateClientIdDTO,
    UpdateExpeditionDTO,
    UpdateHandPilesDTO,
} from './expedition.dto';
import { ExpeditionStatusEnum } from './expedition.enum';
import {
    IExpeditionCurrentNode,
    IExpeditionNode,
    IExpeditionPlayerState,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';
import { generateMap, restoreMap } from 'src/game/map/app';
import { ClientId, getClientIdField } from './expedition.type';
import { CardTargetedEnum } from '../card/card.enum';
import { Context, ExpeditionEntity } from '../interfaces';
import { PlayerService } from '../player/player.service';
import { EnemyService } from '../enemy/enemy.service';
import { EnemyId } from '../enemy/enemy.type';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
    ) {}

    async findOne(payload: FindOneExpeditionDTO): Promise<ExpeditionDocument> {
        return await this.expedition
            .findOne({
                ...payload,
                status: ExpeditionStatusEnum.InProgress,
            })
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
        id: string,
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

    async updateByFilter(
        filter: FilterQuery<ExpeditionDocument>,
        query: UpdateQuery<ExpeditionDocument>,
    ): Promise<boolean> {
        const response = await this.expedition.updateOne(filter, query, {
            new: true,
        });

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

    async getPlayerState(
        payload: GetPlayerStateDTO,
    ): Promise<IExpeditionPlayerState> {
        const { playerState } = await this.expedition
            .findOne(payload)
            .select('playerState')
            .lean();

        return playerState;
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

    async updateHandPiles(payload: UpdateHandPilesDTO): Promise<Expedition> {
        const { hand, exhausted, clientId, draw, discard } = payload;

        const clientField = getClientIdField(clientId);

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

        return await this.expedition
            .findOneAndUpdate(
                {
                    [clientField]: clientId,
                    status: ExpeditionStatusEnum.InProgress,
                },
                piles,
                { new: true },
            )
            .lean();
    }

    /**
     * Get entities based on the type and the context
     *
     * @param ctx Context
     * @param type Type of the entity
     * @param source Source of the action
     * @param [selectedEnemy] Preselected enemy
     *
     * @returns Array of expedition entities
     *
     * @throws Error if the type is not found
     */
    public getEntitiesByType(
        ctx: Context,
        type: CardTargetedEnum,
        source: ExpeditionEntity,
        selectedEnemy: EnemyId,
    ): ExpeditionEntity[] {
        const targets: ExpeditionEntity[] = [];

        switch (type) {
            case CardTargetedEnum.Player:
                targets.push(this.playerService.get(ctx));
                break;
            case CardTargetedEnum.Self:
                targets.push(source);
                break;
            case CardTargetedEnum.AllEnemies:
                targets.push(...this.enemyService.getAll(ctx));
                break;
            case CardTargetedEnum.RandomEnemy:
                targets.push({
                    type: CardTargetedEnum.Enemy,
                    value: this.enemyService.getRandom(ctx).value,
                });
                break;
            case CardTargetedEnum.Enemy:
                targets.push(this.enemyService.get(ctx, selectedEnemy));
                break;
        }

        if (!targets) throw new Error('Target ${type} not found');

        return targets;
    }

    public isCurrentCombatEnded(ctx: Context): boolean {
        return (
            this.playerService.isDead(ctx) || this.enemyService.isAllDead(ctx)
        );
    }
}
