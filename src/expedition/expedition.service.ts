import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expedition } from './expedition.schema';
import { Model } from 'mongoose';
import { ExpeditionDocument } from 'src/types/expeditionDocument.type';
import { CreateExpeditionDto } from './dto/createExpedition.dto';

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
}
