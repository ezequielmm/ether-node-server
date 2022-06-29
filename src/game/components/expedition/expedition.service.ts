import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import { CardService } from '../card/card.service';
import {
    CardExistsOnPlayerHandDTO,
    CreateExpeditionDTO,
    FindOneExpeditionDTO,
    GetCurrentNodeDTO,
    GetDeckCardsDTO,
    GetExpeditionMapDTO,
    GetExpeditionMapNodeDTO,
    playerHasAnExpeditionDTO,
    SetCombatTurnDTO,
    UpdateClientIdDTO,
    UpdateEnemiesArrayDTO,
    UpdateExpeditionDTO,
    UpdateHandPilesDTO,
    UpdatePlayerEnergyDTO,
} from './expedition.dto';
import { ExpeditionStatusEnum } from './expedition.enum';
import {
    IExpeditionCurrentNode,
    IExpeditionNode,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';
import { generateMap, restoreMap } from 'src/game/map/app';
import { ClientId } from './expedition.type';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly cardService: CardService,
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

    async updateClientId(payload: UpdateClientIdDTO): Promise<void> {
        const { clientId, playerId } = payload;
        await this.expedition.findOneAndUpdate({ playerId }, { clientId });
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
        const { clientId, newRound } = payload;
        return await this.expedition.findOneAndUpdate(
            {
                clientId,
                status: ExpeditionStatusEnum.InProgress,
            },
            {
                $set: {
                    'currentNode.data.round': newRound,
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
}
