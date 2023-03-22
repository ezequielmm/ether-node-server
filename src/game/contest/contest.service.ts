import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Contest } from './contest.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateContestDTO } from './contest.dto';

@Injectable()
export class ContestService {
    constructor(
        @InjectModel(Contest)
        private readonly contest: ReturnModelType<typeof Contest>,
    ) {}

    async create(payload: CreateContestDTO): Promise<Contest> {
        return await this.contest.create(payload);
    }

    async getLastEventId(): Promise<number> {
        const last = await this.contest
            .findOne({}, { event_id: 1 })
            .sort({ event_id: -1 });
        return last ? parseInt(last.event_id) : 0;
    }

    async findContestByDate(targetDate: Date): Promise<Contest> {
        const start = targetDate;
        start.setUTCHours(0, 0, 0, 0);

        const end = targetDate;
        end.setUTCHours(23, 59, 59, 999);

        const contest = await this.contest.findOne({
            available_at: { $gte: start, $lte: end },
        }).lean(); // find the one that starts on this day.

        if (!contest) {
            const valid_until = new Date();
            valid_until.setTime(start.getTime() + 30 * 60 * 60 * 1000);

            return {
                map_id: '',
                event_id: '',
                available_at: start,
                ends_at: end,
                valid_until: valid_until,
            };
        }

        contest.updateEndTimes();

        return contest;
    }

    async findActive(): Promise<Contest> {
        return this.findContestByDate(new Date());
    }

    async isValid(contest: Contest): Promise<boolean> {
        if (!(contest.valid_until instanceof Date)) {
            if (typeof contest.updateEndTimes === 'function') {
                contest.updateEndTimes();
            } else {
                return false;
            }
        }
        return new Date() <= contest.valid_until;
    }
}
