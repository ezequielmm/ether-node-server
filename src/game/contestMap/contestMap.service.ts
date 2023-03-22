import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ContestMap, ContestMapDocument } from './contestMap.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateContestMapDTO } from './contestMap.dto';
import { FilterQuery, ProjectionFields } from 'mongoose';

@Injectable()
export class ContestMapService {
    constructor(
        @InjectModel(ContestMap)
        private readonly contestMap: ReturnModelType<typeof ContestMap>,
    ) {}

    async create(payload: CreateContestMapDTO): Promise<ContestMapDocument> {
        return await this.contestMap.create(payload);
    }

    async findById(id: string): Promise<ContestMap> {
        return await this.contestMap.findById(id).lean();
    }

    async findOne(
        filter: FilterQuery<ContestMap>,
        projection?: ProjectionFields<ContestMap>,
    ): Promise<ContestMap> {
        return await this.contestMap.findOne(filter, projection).lean();
    }

    async find(
        filter: FilterQuery<ContestMap>,
        projection?: ProjectionFields<ContestMap>,
    ): Promise<ContestMap[]> {
        return await this.contestMap.find(filter, projection).lean();
    }
}
