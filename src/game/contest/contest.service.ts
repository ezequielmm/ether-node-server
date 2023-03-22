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

    async findActive(): Promise<Contest> {
        const start = new Date();
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date();
        end.setUTCHours(23, 59, 59, 999);

        const current = await this.contest.findOne({
            available_at: { $gte: start, $lte: end },
        }); // find the one that starts on this day.

        if (!current) {
            const valid_until = new Date();
            valid_until.setTime(start.getTime() + 30 * 60 * 60 * 1000);

            return {
                map_id: '',
                event_id: '',
                available_at: start,
                ends_at: end,
                valid_until: valid_until,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                updateEndTimes(): void {},
            };
        }

        current.updateEndTimes();

        return current;
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
