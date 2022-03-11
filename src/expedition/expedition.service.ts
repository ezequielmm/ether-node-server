import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private model: Model<ExpeditionDocument>,
    ) {}

    async createExpedition_V1(expedition: Expedition): Promise<Expedition> {
        const newExpedition = new this.model(expedition);
        return newExpedition.save();
    }

    async getExpeditionByPlayerId_V1(player_id: string): Promise<Expedition[]> {
        return await this.model.find({ player_id }).exec();
    }

    async playerHasAnExpedition(player_id: string): Promise<boolean> {
        const itemExists = await this.model
            .findOne({ player_id, status: 'in_progress' })
            .select('_id')
            .lean();
        return itemExists ? false : true;
    }
}
