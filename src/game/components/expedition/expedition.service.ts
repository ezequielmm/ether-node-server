import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import { CardService } from '../card/card.service';
import {
    FindOneExpeditionDTO,
    playerHasAnExpeditionDTO,
} from './expedition.dto';
import { ExpeditionStatusEnum } from './expedition.enum';

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

    async playerHasExpeditionInProgress(
        payload: playerHasAnExpeditionDTO,
    ): Promise<boolean> {
        const item = await this.expedition.exists({
            ...payload,
            status: ExpeditionStatusEnum.InProgress,
        });
        return item !== null;
    }
}
