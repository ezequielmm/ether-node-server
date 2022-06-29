import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import { CardService } from '../card/card.service';
import {
    CreateExpeditionDTO,
    FindOneExpeditionDTO,
    playerHasAnExpeditionDTO,
} from './expedition.dto';
import { ExpeditionStatusEnum } from './expedition.enum';
import { IExpeditionNode } from './expedition.interface';
import { generateMap } from 'src/game/map/app';

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
}
