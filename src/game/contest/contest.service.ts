import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Contest } from './contest.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class ContestService {
    constructor(
        @InjectModel(Contest)
        private readonly contest: ReturnModelType<typeof Contest>,
    ) {}

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
                updateEndTimes(): void {},
            };
        }

        current.updateEndTimes();

        return current;
    }

    async isValid(contest: Contest): Promise<boolean> {
        contest.updateEndTimes();
        return new Date() <= contest.valid_until;
    }
}
