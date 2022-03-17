import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExpeditionDto } from './dto/createExpedition.dto';
import {
    Expedition,
    ExpeditionDocument,
    ExpeditionStatus,
} from './expedition.schema';
import { v4 as uuidv4 } from 'uuid';
import { map } from './mapGenerator';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private model: Model<ExpeditionDocument>,
    ) {}

    async createExpedition_V1(
        expedition: CreateExpeditionDto,
    ): Promise<Expedition> {
        const { player_id } = expedition;
        if (await this.playerHasAnExpedition(player_id)) {
            return await this.getExpeditionByPlayerId(player_id);
        } else {
            const data: Expedition = {
                player_id,
                _id: uuidv4(),
                deck: [{ card_instances: null }],
                map: map,
                player_state: {},
                current_state: {},
                status: ExpeditionStatus.InProgress,
            };
            const newExpedition = new this.model(data);
            return newExpedition.save();
        }
    }

    async getExpeditionByPlayerId(player_id: string): Promise<Expedition> {
        return await this.model.findOne({ player_id }).select('-__v').exec();
    }

    async playerHasAnExpedition(player_id: string): Promise<boolean> {
        const itemExists = await this.model
            .findOne({ player_id, status: 'in_progress' })
            .select('_id')
            .lean();
        return itemExists === null ? false : true;
    }

    async expeditionBelongsToPlayer(
        player_id: string,
        expedition_id: string,
    ): Promise<boolean> {
        const itemExists = await this.model
            .findOne({
                player_id,
                _id: expedition_id,
            })
            .select('_id')
            .lean();
        return itemExists === null ? false : true;
    }
}
