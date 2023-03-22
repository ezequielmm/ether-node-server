import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Contest } from './contest.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateContestDTO } from './contest.dto';
import { FilterQuery, ProjectionFields } from 'mongoose';

@Injectable()
export class ContestService {
    constructor(
        @InjectModel(Contest)
        private readonly contest: ReturnModelType<typeof Contest>,
    ) {}

    async create(payload: CreateContestDTO): Promise<Contest> {
        return await this.contest.create(payload);
    }

    async findAll(
        filter?: FilterQuery<Contest>,
        projection?: ProjectionFields<Contest>,
    ): Promise<Contest[]> {
        return await this.contest.find(filter, projection).lean();
    }

    async findOne(
        filter?: FilterQuery<Contest>,
        projection?: ProjectionFields<Contest>,
    ): Promise<Contest> {
        return await this.contest.findOne(filter, projection).lean();
    }

    async getLastEventId(): Promise<number> {
        const last = await this.contest
            .findOne({}, { event_id: 1 })
            .sort({ event_id: -1 });
        return last ? last.event_id : 0;
    }

    async isValid(contest: Contest): Promise<boolean> {
        return new Date() <= contest.valid_until;
    }
}
