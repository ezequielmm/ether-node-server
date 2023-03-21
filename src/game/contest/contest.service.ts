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

        current.valid_until = this.getValidUntil(current.available_at);
        
        return current;
    }

    private getValidUntil(startTime: Date) {
        const contest_duration = 24;
        const valid_extension = 6;
        const valid_until = new Date();
        valid_until.setTime(
            startTime.getTime() + 
            ( 
                (contest_duration + valid_extension) 
                * 60 * 60 * 1000
            )
        );
        return valid_until;
    }

    async isValid(contest: Contest) {
        return new Date() <= (contest.valid_until ?? this.getValidUntil(contest.available_at));
    }

}
