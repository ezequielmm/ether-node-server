import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ContestMap } from './contestMap.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class ContestMapService {
    constructor(
        @InjectModel(ContestMap)
        private readonly contestMap: ReturnModelType<typeof ContestMap>,
    ) {}

    async findAllWins(): Promise<ContestMap[]> {
        const items = await this.contestMap.find();
        return items;
    }
}
