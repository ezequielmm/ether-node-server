import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import { CardService } from '../card/card.service';
import {
    CreateExpeditionDTO,
    FindOneExpeditionDTO,
    GetDeckCardsDTO,
    GetExpeditionMapDTO,
    GetExpeditionMapNodeDTO,
    playerHasAnExpeditionDTO,
    SetCombatTurnDTO,
    UpdateClientIdDTO,
    UpdateExpeditionDTO,
} from './expedition.dto';
import { ExpeditionStatusEnum } from './expedition.enum';
import {
    IExpeditionNode,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';
import { generateMap, restoreMap } from 'src/game/map/app';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly cardService: CardService,
    ) {}

    async findOne(payload: FindOneExpeditionDTO): Promise<ExpeditionDocument> {
        payload;
        return await this.expedition.findOne({
            ...payload,
            status: ExpeditionStatusEnum.InProgress,
        });
    }

    async create(payload: CreateExpeditionDTO): Promise<ExpeditionDocument> {
        return await this.expedition.create(payload);
    }

    async update(payload: UpdateExpeditionDTO): Promise<ExpeditionDocument> {
        const { clientId } = payload;
        return await this.expedition.findOneAndUpdate(
            {
                clientId,
            },
            payload,
            { new: true },
        );
    }

    async playerHasExpeditionInProgress(
        payload: playerHasAnExpeditionDTO,
    ): Promise<boolean> {
        const item = await this.expedition.exists({
            ...payload,
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
        return restoreMap(map, payload.clientId).getMap;
    }

    async getDeckCards(
        payload: GetDeckCardsDTO,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        const {
            playerState: { cards },
        } = await this.expedition
            .findOne(payload)
            .select('playerState.deck')
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
}
