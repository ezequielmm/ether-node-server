import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { ContestMap, ContestMapDocument } from './contestMap.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateContestMapDTO } from './contestMap.dto';

@Injectable()
export class ContestMapService {
    constructor(
        @InjectModel(ContestMap)
        private readonly contestMap: ReturnModelType<typeof ContestMap>,
    ) {}

    async create(payload: CreateContestMapDTO): Promise<ContestMapDocument> {
        return await this.contestMap.create(payload);
    }

    async find(id: string): Promise<ContestMap> {
        return await this.contestMap.findById(id);
    }

    async findAll(): Promise<ContestMap[]> {
        return await this.contestMap.find();
    }
}
