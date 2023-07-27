import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ContestMap, ContestMapDocument } from './contestMap.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateContestMapDTO } from './contestMap.dto';
import { FilterQuery, ProjectionFields } from 'mongoose';
import { Contest } from '../contest/contest.schema';

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
        return await this.contestMap.findById(id);
    }

    async findOne(
        filter?: FilterQuery<ContestMap>,
        projection?: ProjectionFields<ContestMap>,
    ): Promise<ContestMap> {
        return await this.contestMap.findOne(filter, projection);
    }

    async find(
        filter: FilterQuery<ContestMap>,
        projection?: ProjectionFields<ContestMap>,
    ): Promise<ContestMap[]> {
        return await this.contestMap.find(filter, projection);
    }

    async getMapForContest(contest: Contest) {
        const map = await this.findById(contest.map_id);
        return map.nodes ?? [];
    }

    async getCompleteMapForContest(contest: Contest) {
        return await this.findById(contest.map_id);
    }
}
