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
        var start = new Date();
        start.setUTCHours(0,0,0,0);
        
        var end = new Date();
        end.setUTCHours(23,59,59,999);

        const current = await this.contest.findOne({"available_at": {"$gte": start, "$lte": end}}); // find the one that starts on this day.

        // TODO: Figure out how to make this valid in Typescript, since mongoose casts on retrieval.
        // current.valid_until = current.available_at;
        // current.valid_until.setTime(current.available_at.getTime() + (h*60*60*1000));
        
        return current;
    }

    async isValid(contest: Contest) {
        // TODO: Make this work once dates are in.
        // Check if current time > contest.valid_until, once contest.valid_until is actually being populated in the findActive function.
        return true;
    }


}
