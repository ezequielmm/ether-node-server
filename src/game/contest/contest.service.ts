import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Contest } from './contest.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateContestDTO } from './contest.dto';
import { FilterQuery, ProjectionFields } from 'mongoose';
import { addDaysToDate, setHoursMinutesSecondsToUTCDate } from 'src/utils';

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

    async deleteMany(filter?: FilterQuery<Contest>): Promise<void> {
        await this.contest.deleteMany(filter);
    }

    async findOne(
        filter?: FilterQuery<Contest>,
        projection?: ProjectionFields<Contest>,
    ): Promise<Contest> {
        return await this.contest.findOne(filter, projection).lean();
    }

    async exists(filter: FilterQuery<Contest>): Promise<boolean> {
        const contestExists = await this.contest.exists(filter).lean();
        return contestExists !== null;
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

    async findActiveContest(availableAt = new Date()): Promise<Contest> {

        const currentUTCHours = new Date().getUTCHours();
        const hasPassed4PMUTC = currentUTCHours >= 16;

        //- Si no pasaron las 4PM UTC el contests es el de ayer:
        console.log("---------------------------------------------------------------------------")
        console.log("availableAT previous if")
        console.log(availableAt)
        if(!hasPassed4PMUTC){
            availableAt = addDaysToDate(availableAt, -1)
            console.log("avaliableAt after if:")
            console.log(availableAt)
            console.log("---------------------------------------------------------------------------")
        }

        const endsAtComplete = setHoursMinutesSecondsToUTCDate(
            addDaysToDate(availableAt),
            15,
            59,
            59,
            999,
        );

        availableAt.setUTCHours(16, 0, 0, 0);

        return await this.findOne({
            available_at: { $gte: availableAt },
            ends_at: { $lte: endsAtComplete },
        });
    }
}
