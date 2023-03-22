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

    async find(id: string): Promise<ContestMap> {
        return await this.contestMap.findById(id);
    }

    async findAll(): Promise<ContestMap[]> {
        return await this.contestMap.find();
    }
}
