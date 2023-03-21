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
        current.valid_until = current.available_at;
        current.valid_until.setTime(
            current.available_at.getTime() + 6 * 60 * 60 * 1000,
        );

        return current;
    }

    isValid(contest: Contest): boolean {
        const now = new Date();
        now.setTime(now.getTime() + (30*60*60*1000));
        return now.getTime() < contest.valid_until.getTime();
    }
}
