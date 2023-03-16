import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Contest } from './contest.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class ContestService {
    constructor(
        @InjectModel(Contest)
        private readonly contestMap: ReturnModelType<typeof Contest>,
    ) {}
}
