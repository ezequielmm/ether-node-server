import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expedition } from './expedition.schema';
import { Model } from 'mongoose';
import { ExpeditionDocument } from 'src/types/expeditionDocument.type';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { CreateExpeditionDTO } from './dto/createExpedition.dto';
import { UpdateExpeditionDTO } from './dto/updateExpedition.dto';
import { ExpeditionMapInterface } from '../interfaces/expeditionMap.interface';
import { ExpeditionPlayerStateDeckCardInterface } from '../interfaces/expeditionPlayerStateDeckCard.interface';
import { ExpeditionCurrentNodeInterface } from '../interfaces/expeditionCurrentNode.interface';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
    ) {}

    async create(data: CreateExpeditionDTO): Promise<Expedition> {
        const expedition = new this.expedition(data);
        return expedition.save();
    }

    async updateExpeditionInProgressByPlayerId(
        player_id: string,
        data: UpdateExpeditionDTO,
    ): Promise<Expedition> {
        return this.expedition.findOneAndUpdate(
            {
                player_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            data,
        );
    }

    async updateExpeditionInProgressByClientId(
        client_id: string,
        data: UpdateExpeditionDTO,
    ): Promise<Expedition> {
        return this.expedition.findOneAndUpdate(
            {
                client_id,
                status: ExpeditionStatusEnum.InProgress,
            },
            data,
        );
    }

    async playerHasAnExpedition(
        player_id: string,
        status: ExpeditionStatusEnum,
    ): Promise<boolean> {
        const itemExists = await this.expedition.exists({ player_id, status });
        return itemExists !== null;
    }

    async getActiveExpeditionByClientId(
        client_id: string,
    ): Promise<Expedition> {
        return this.expedition.findOne({ client_id });
    }

    async getExpeditionMapNodeById(
        client_id: string,
        node_id: number,
    ): Promise<ExpeditionMapInterface> {
        const map = await this.expedition
            .findOne({
                client_id,
                'map.id': node_id,
            })
            .select('map')
            .lean();

        if (!map.map) return null;

        return map.map.filter((node) => node.id === node_id)[0];
    }

    async getCardsByClientId(
        client_id: string,
    ): Promise<ExpeditionPlayerStateDeckCardInterface[]> {
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

    async cardExistsOnPlayerHand(
        client_id: string,
        card_id: string,
    ): Promise<boolean> {
        const itemExists = await this.expedition.exists({
            client_id,
            'current_node.data.player.cards.hand.id': card_id,
        });
        return itemExists !== null;
    }

    async getCurrentNodeByClientId(
        client_id: string,
    ): Promise<ExpeditionCurrentNodeInterface> {
        const { current_node } = await this.expedition
            .findOne({ client_id })
            .select('current_node')
            .lean();
        return current_node;
    }

    async moveCardFromPlayerHandToDiscardPile(
        client_id: string,
        card_id: string,
    ): Promise<Expedition> {
        const currentNode = await this.getCurrentNodeByClientId(client_id);

        return this.expedition.findOneAndUpdate(
            { client_id },
            {
                $pull: {
                    'current_node.data.player.cards.hand': { id: card_id },
                },
                $push: {
                    'current_node.data.player.cards.discard':
                        currentNode.data.player.cards.hand.filter((card) => {
                            return card.id === card_id;
                        }),
                },
            },
        );
    }

    async updatePlayerEnergy(
        client_id: string,
        newEnergyAmount: number,
    ): Promise<Expedition> {
        return this.expedition.findOneAndUpdate(
            { client_id },
            { 'current_node.data.player.energy': newEnergyAmount },
            { new: true },
        );
    }
}
