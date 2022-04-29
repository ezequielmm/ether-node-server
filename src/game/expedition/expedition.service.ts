import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import { ExpeditionMapNodeTypeEnum, ExpeditionStatusEnum } from './enums';
import {
    CardExistsDTO,
    CreateExpeditionDTO,
    GetExpeditionDTO,
    UpdateExpeditionDTO,
    UpdateExpeditionFilterDTO,
    UpdatePlayerEnergyDTO,
    UpdateSocketClientDTO,
} from './dto';
import {
    IExpeditionCurrentNode,
    IExpeditionMap,
    IExpeditionPlayerStateDeckCard,
} from './interfaces';
import { Types } from 'mongoose';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
    ) {}

    async playerHasExpeditionInProgress(player_id: string): Promise<boolean> {
        const itemExists = await this.expedition.exists({
            player_id,
            status: ExpeditionStatusEnum.InProgress,
        });
        return itemExists !== null;
    }

    async create(payload: CreateExpeditionDTO): Promise<ExpeditionDocument> {
        return await this.expedition.create(payload);
    }

    getMap(): IExpeditionMap[] {
        return [
            {
                act: 0,
                step: 0,
                id: 1,
                type: ExpeditionMapNodeTypeEnum.Combat,
                exits: [3, 4],
                enter: null,
            },
            {
                act: 0,
                step: 0,
                id: 2,
                type: ExpeditionMapNodeTypeEnum.Combat,
                exits: [4],
                enter: null,
            },
            {
                act: 0,
                step: 1,
                id: 3,
                type: ExpeditionMapNodeTypeEnum.Combat,
                exits: [5],
                enter: [1],
            },
            {
                act: 0,
                step: 1,
                id: 4,
                type: ExpeditionMapNodeTypeEnum.Combat,
                exits: [5],
                enter: [1, 2],
            },
            {
                act: 0,
                step: 2,
                id: 5,
                type: ExpeditionMapNodeTypeEnum.Combat,
                exits: [6, 7, 8],
                enter: [3, 4],
            },
            {
                act: 1,
                step: 0,
                id: 6,
                type: ExpeditionMapNodeTypeEnum.Combat,
                exits: [],
                enter: [5],
            },
            {
                act: 1,
                step: 0,
                id: 7,
                type: ExpeditionMapNodeTypeEnum.Combat,
                exits: [],
                enter: [5],
            },
            {
                act: 1,
                step: 0,
                id: 8,
                type: ExpeditionMapNodeTypeEnum.Combat,
                exits: [],
                enter: [5],
            },
        ];
    }

    async updateClientId(
        payload: UpdateSocketClientDTO,
    ): Promise<ExpeditionDocument> {
        const { client_id, player_id } = payload;
        return this.expedition.findOneAndUpdate(
            {
                player_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            { client_id },
            { new: true },
        );
    }

    async findOne(payload: GetExpeditionDTO): Promise<ExpeditionDocument> {
        return this.expedition.findOne(payload).lean();
    }

    async getExpeditionMapNode(
        client_id: string,
        node_id: number,
    ): Promise<IExpeditionMap> {
        const { map } = await this.expedition
            .findOne({
                client_id,
                'map.id': node_id,
            })
            .select('map')
            .lean();

        if (!map) return null;

        return map.filter((node) => node.id === node_id)[0];
    }

    async getDeckCards(
        client_id: string,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        const {
            player_state: {
                deck: { cards },
            },
        } = await this.expedition
            .findOne({ client_id })
            .select('player_state.deck')
            .lean();

        return cards;
    }

    async update(
        filter: UpdateExpeditionFilterDTO,
        payload: UpdateExpeditionDTO,
    ): Promise<ExpeditionDocument> {
        return this.expedition.findOneAndUpdate(filter, payload, {
            new: true,
        });
    }

    async cardExistsOnPlayerHand(payload: CardExistsDTO): Promise<boolean> {
        const { card_id, client_id } = payload;
        const itemExists = await this.expedition.exists({
            client_id,
            status: ExpeditionStatusEnum.InProgress,
            'current_node.data.player.cards.hand.id': card_id,
        });
        return itemExists !== null;
    }

    async getCurrentNodeByClientId(
        client_id: string,
    ): Promise<IExpeditionCurrentNode> {
        const { current_node } = await this.expedition
            .findOne({ client_id, status: ExpeditionStatusEnum.InProgress })
            .select('current_node')
            .lean();
        return current_node;
    }

    async moveCardFromPlayerHandToDiscardPile(
        payload: CardExistsDTO,
    ): Promise<ExpeditionDocument> {
        const { client_id, card_id } = payload;

        const current_node = await this.getCurrentNodeByClientId(client_id);

        return this.expedition.findOneAndUpdate(
            { client_id, status: ExpeditionStatusEnum.InProgress },
            {
                $pull: {
                    'current_node.data.player.cards.hand': {
                        id: card_id,
                    },
                },
                $push: {
                    'current_node.data.player.cards.discard':
                        current_node.data.player.cards.hand.filter((card) => {
                            return card.id === card_id;
                        })[0],
                },
            },
            { new: true },
        );
    }

    async updatePlayerEnergy(
        payload: UpdatePlayerEnergyDTO,
    ): Promise<Expedition> {
        const { client_id, energy } = payload;
        return this.expedition.findOneAndUpdate(
            { client_id, status: ExpeditionStatusEnum.InProgress },
            { 'current_node.data.player.energy': energy },
            { new: true },
        );
    }
}
