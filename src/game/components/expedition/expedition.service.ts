import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { UpdateQuery, FilterQuery, ProjectionFields } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import {
    CardExistsOnPlayerHandDTO,
    CreateExpeditionDTO,
    GetCurrentNodeDTO,
    GetDeckCardsDTO,
    GetPlayerStateDTO,
    OverrideAvailableNodeDTO,
    playerHasAnExpeditionDTO,
    SetCombatTurnDTO,
    UpdateClientIdDTO,
    UpdateExpeditionDTO,
    UpdateHandPilesDTO,
    UpdatePlayerDeckDTO,
} from './expedition.dto';
import { ExpeditionStatusEnum } from './expedition.enum';
import {
    IExpeditionCurrentNode,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';
import { Node } from './node';
import { Player } from './player';
import { ClientId, getClientIdField } from './expedition.type';
import { CardTargetedEnum } from '../card/card.enum';
import { GameContext, ExpeditionEntity } from '../interfaces';
import { PlayerService } from '../player/player.service';
import { EnemyService } from '../enemy/enemy.service';
import { EnemyId } from '../enemy/enemy.type';
import { Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReturnModelType } from '@typegoose/typegoose';
import { ModuleRef } from '@nestjs/core';
import { MapService } from 'src/game/map/map.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly moduleRef: ModuleRef,
        private readonly mapService: MapService,
        private readonly configService: ConfigService,
    ) {}

    async getExpeditionIdFromClient(clientId: string): Promise<string> {
        const expedition = await this.findOne({ clientId }, { id: 1 });
        return expedition.id;
    }

    async getGameContext(client: Socket): Promise<GameContext> {
        const expedition = await this.findOne({ clientId: client.id });
        const events = new EventEmitter2();

        if (!expedition?.playerState) {
            throw new Error('Player state not found');
        }

        const ctx: GameContext = {
            expedition,
            client,
            events,
            moduleRef: this.moduleRef,
            info: {
                env: this.configService.get<string>('PAPERTRAIL_ENV'),
                account: expedition?.playerState.email,
                expeditionId: expedition !== null ? expedition.id : null,
                service: this.configService.get<string>('PAPERTRAIL_SERVICE'),
            },
        };

        for (const trinket of expedition.playerState?.trinkets) {
            trinket.onAttach(ctx);
        }

        return ctx;
    }

    async findOne(
        filter: FilterQuery<Expedition>,
        projection?: ProjectionFields<Expedition>,
    ): Promise<ExpeditionDocument> {
        return await this.expedition
            .findOne(filter, projection)
            .sort({ createdAt: 1 })
            .lean();
    }

    async findOneTimeDesc(
        filter: FilterQuery<Expedition>,
        projection?: ProjectionFields<Expedition>,
    ): Promise<ExpeditionDocument> {
        return await this.expedition
            .findOne(filter, projection)
            .sort({ createdAt: -1 });
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
        // Using updateOne to save a bit of time and bandwidth
        // it is not necessary to return the updated document
        const response = await this.expedition.findByIdAndUpdate(id, query, {
            new: true,
        });

        // Return if expedition was updated
        return response !== null;
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

    async updateClientId(
        payload: UpdateClientIdDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, playerId } = payload;
        return await this.expedition.findOneAndUpdate(
            { playerId, status: ExpeditionStatusEnum.InProgress },
            { clientId, isCurrentlyPlaying: true },
        );
    }

    async updatePlayerStatus(payload: {
        clientId: string;
        isCurrentlyPlaying: boolean;
    }): Promise<void> {
        const { clientId, isCurrentlyPlaying } = payload;
        await this.expedition.updateOne({ clientId }, { isCurrentlyPlaying });
    }

    async getExpeditionMap(ctx: GameContext): Promise<Node[]> {
        return ctx.expedition.map;
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

    async getPlayerState(payload: GetPlayerStateDTO): Promise<Player> {
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
                    ...(typeof newRound !== 'undefined' && {
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

        const objectRoute = 'currentNode.data.player.cards';

        const piles = {
            ...(hand && { [`${objectRoute}.hand`]: hand }),
            ...(exhausted && {
                [`${objectRoute}.exhausted`]: exhausted,
            }),
            ...(draw && {
                [`${objectRoute}.draw`]: draw,
            }),
            ...(discard && {
                [`${objectRoute}.discard`]: discard,
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
        ctx: GameContext,
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

        if (!targets) throw new Error(`Target ${type} not found`);

        return targets;
    }

    public isCurrentCombatEnded(ctx: GameContext): boolean {
        return (
            this.playerService.isDead(ctx) || this.enemyService.isAllDead(ctx)
        );
    }

    public isEntityDead(ctx: GameContext, target: ExpeditionEntity): boolean {
        if (PlayerService.isPlayer(target)) {
            return this.playerService.isDead(ctx);
        } else if (EnemyService.isEnemy(target)) {
            return this.enemyService.isDead(target);
        }
    }

    async updatePlayerDeck(payload: UpdatePlayerDeckDTO): Promise<Expedition> {
        const { clientId, deck } = payload;

        const clientField = getClientIdField(clientId);

        return await this.expedition
            .findOneAndUpdate(
                {
                    [clientField]: clientId,
                    status: ExpeditionStatusEnum.InProgress,
                },
                {
                    $set: {
                        'playerState.cards': deck,
                    },
                },
                { new: true },
            )
            .lean();
    }

    async overrideAvailableNode(
        payload: OverrideAvailableNodeDTO,
    ): Promise<void> {
        const { ctx, nodeId } = payload;

        const node = this.mapService.findNodeById(ctx, nodeId);
        this.mapService.enableNode(ctx, nodeId);

        ctx.expedition.currentNode = {
            nodeId: node.id,
            completed: true,
            nodeType: node.type,
            showRewards: false,
        };

        await ctx.expedition.save();
    }

    async findTopScores(event_id: number, limit: number): Promise<any[]> {
        limit = limit > 50 ? 50 : limit;
        limit = limit < 10 ? 10 : limit;
        const expedition = await this.expedition
            .find({ 'contest.event_id': event_id })
            .sort({ 'finalScore.totalScore': -1 })
            .limit(limit);

        const finalScores = [];
        expedition.forEach((item) => {
            if (item.finalScore) {
                const endedAt = item.endedAt;
                const startedAt = item.createdAt;
                const duration = Math.floor(
                    (endedAt.getTime() - startedAt.getTime()) / 1000,
                );
                const summary = {
                    totalScore: item.finalScore.totalScore,
                    playerName: item.playerState.playerName,
                    characterClass: item.playerState.characterClass,
                    duration,
                    endedAt,
                };
                finalScores.push(summary);
            }
        });

        return finalScores;
    }
}
