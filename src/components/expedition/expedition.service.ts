import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expedition, ExpeditionDocument } from './expedition.schema';
import { ExpeditionMapNodeTypeEnum, ExpeditionStatusEnum } from './enums';
import { CreateExpeditionDTO } from './dto';
import { IExpeditionMap } from './interfaces';

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
}
