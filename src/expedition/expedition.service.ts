import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExpeditionDto } from './dto/createExpedition.dto';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExpeditionService {
    constructor(
        @InjectModel(Expedition.name)
        private model: Model<ExpeditionDocument>,
    ) {}

    async createExpedition_V1(
        expedition: CreateExpeditionDto,
    ): Promise<Expedition> {
        const data: Expedition = {
            ...expedition,
            _id: uuidv4(),
            deck: '',
            map: '',
            nodes: '',
            player_state: '',
            current_state: '',
            status: 'in_progress',
        };
        const newExpedition = new this.model(data);
        return newExpedition.save();
    }

    async getExpeditionById_V1(id: string): Promise<Expedition[]> {
        return await this.model.find({ _id: id }).exec();
    }

    async playerHasAnExpedition(player_id: string): Promise<boolean> {
        const itemExists = await this.model
            .findOne({ player_id, status: 'in_progress' })
            .select('_id')
            .lean();
        return itemExists ? false : true;
    }
}
