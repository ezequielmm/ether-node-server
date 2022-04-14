import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expedition } from './expedition.schema';
import { Model } from 'mongoose';
import { ExpeditionDocument } from 'src/types/expeditionDocument.type';
import { CreateExpeditionDto } from './dto/createExpedition.dto';
import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { UpdateExpeditionDto } from './dto/updateExpedition.dto';
import { ExpeditionMapInterface } from 'src/interfaces/expeditionMap.interface';
import { ExpeditionPlayerStateDeckCardInterface } from 'src/interfaces/expeditionPlayerStateDeckCard.interface';
import { ExpeditionCurrentNodeInterface } from 'src/interfaces/expeditionCurrentNode.interface';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
    ) {}

    async createExpedition(data: CreateExpeditionDto): Promise<Expedition> {
        const expedition = new this.expedition(data);
        return expedition.save();
    }

    async playerHasAnExpedition(
        player_id: string,
        status: ExpeditionStatusEnum,
    ): Promise<boolean> {
        const itemExists = await this.expedition.exists({ player_id, status });
        return itemExists === null ? false : true;
    }

    async updateExpeditionByPlayerId(
        player_id: string,
        payload: UpdateExpeditionDto,
    ): Promise<Expedition> {
        return await this.expedition.findOneAndUpdate({ player_id }, payload, {
            new: true,
        });
    }

    async getExpeditionByPlayerId(player_id: string): Promise<Expedition> {
        return await this.expedition.findOne({ player_id }).lean();
    }

    async getExpeditionMapNodeById(
        player_id: string,
        node_id: number,
    ): Promise<ExpeditionMapInterface> {
        const map = await this.expedition
            .findOne({
                player_id,
                'map.id': node_id,
            })
            .select('map')
            .lean();

        if (!map?.map) return null;

        return map.map.filter((node) => node.id === node_id)[0];
    }

    async getCardsByPlayerId(
        player_id: string,
    ): Promise<ExpeditionPlayerStateDeckCardInterface[]> {
        const {
            player_state: {
                deck: { cards },
            },
        } = await this.expedition
            .findOne({ player_id })
            .select('player_state.deck')
            .lean();

        return cards;
    }

    async getCurrentNodeByPlayerId(
        player_id: string,
    ): Promise<ExpeditionCurrentNodeInterface> {
        const { current_node } = await this.expedition
            .findOne({ player_id })
            .select('current_node')
            .lean();
        return current_node;
    }

    async cardExistsOnPlayerHand(
        player_id: string,
        card_id: string,
    ): Promise<boolean> {
        const itemExists = await this.expedition.exists({
            player_id,
            'current_node.data.player.cards.hand.id': card_id,
        });
        return itemExists === null ? false : true;
    }

    async moveCardFromPlayerHandToDiscard(
        player_id: string,
        card_id: string,
    ): Promise<Expedition> {
        const currentNode = await this.getCurrentNodeByPlayerId(player_id);
        return await this.expedition.findOneAndUpdate(
            { player_id },
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

    composeErrorMessage(message: string, statusCode: HttpStatus): void {
        throw new HttpException(
            {
                data: {
                    message,
                    status: statusCode,
                },
            },
            statusCode,
        );
    }
}
