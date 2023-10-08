import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { UpdateQuery, FilterQuery, ProjectionFields } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import {
    CardExistsOnPlayerHandDTO,
    CreateExpeditionDTO,
    CreateMapDTO,
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
import { getClientIdField } from './expedition.type';
import { GameContext } from '../interfaces';
import { Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReturnModelType } from '@typegoose/typegoose';
import { ModuleRef } from '@nestjs/core';
import { MapService } from 'src/game/map/map.service';
import { ConfigService } from '@nestjs/config';
import { NodeType } from './node-type';
import { MapDocument, MapType } from './map.schema';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,
        private readonly moduleRef: ModuleRef,
        private readonly mapService: MapService,
        private readonly configService: ConfigService,

        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>,
    ) {}

    async getExpeditionIdFromClient(client: Socket): Promise<string> {
        const expedition = await this.findOneTimeDesc({userAddress: client.request.headers.useraddress});
        return expedition.id;
    }

    async getGameContext(client: Socket): Promise<GameContext> {
        const expedition = await this.findOneTimeDesc(
            { 
                userAddress: client.request.headers.useraddress
            });
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
                account: expedition?.playerState.userAddress,
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
            .sort({ createdAt: 1 });
        // NOTE: This cannot be lean without breaking map node objects!
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

    async createMapReferenced(payload: CreateMapDTO): Promise<MapDocument> {
        return await this.mapModel.create(payload);
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
        clientId: string,
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
        const { clientId, userAddress } = payload;
        return await this.expedition.findOneAndUpdate(
            { userAddress, status: ExpeditionStatusEnum.InProgress },
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
        return await this.getMapByExpedition(ctx.expedition.id);
    }

    isPlayerInCombat(ctx: GameContext): boolean {
        const nodeType = ctx.expedition?.currentNode?.nodeType;
        return nodeType === NodeType.Combat;
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

        const node = await this.mapService.findNodeById(ctx, nodeId);
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

    public async getMapByExpedition(expeditionId: string): Promise<Node[]> {
        try {
            // Utiliza `findOne` para encontrar la expedición por su _id
            const expedition = await this.expedition.findOne({
                _id: expeditionId,
            });
    
            // Si no se encuentra la expedición, retorna un array vacío
            if (!expedition) {
                return [];
            }
    
            // Obtiene el ObjectID del campo map en la expedición
            const mapId = expedition.map; // Accede al campo mapRef en el objeto map
    
            // Utiliza el ObjectID para buscar el documento en la colección "maps" que coincide con el valor del campo map en la expedición
            const map = await this.mapModel.findOne({
                '_id': mapId
            });
    
            // Si no se encuentra el mapa, retorna un array vacío
            if (!map) {
                return [];
            }
    
            // Retorna el array de nodos almacenados en el campo map del mapa encontrado
            return map.map;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving maps: ' + error.message);
        }
    }
}
