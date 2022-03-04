import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private expeditionModel: Model<ExpeditionDocument>,
    ) {}

    async createExpedition_V1(expedition: Expedition): Promise<Expedition> {
        const newExpedition = new this.expeditionModel(expedition);
        return newExpedition.save();
    }

    async getExpeditionByPlayerId_V1(player_id: string): Promise<Expedition[]> {
        return await this.expeditionModel.find({ player_id }).exec();
    }
}
