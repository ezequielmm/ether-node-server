import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { FilterQuery, Model } from 'mongoose';
import { getRandomItemByWeight } from 'src/utils';
import { Chest } from './chest.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class ChestService {
    constructor(
        @InjectModel(Chest) private readonly chest: ReturnModelType<typeof Chest>,
    ) { }

    async getRandomChest(): Promise<Chest> {
        const chests = await this.chest.find({}).lean();

        return getRandomItemByWeight<Chest>(
            chests.map((chest) => chest),
            chests.map(({ chance }) => chance),
        );
    }

    async findOne(filter: FilterQuery<Chest>): Promise<Chest> {
        return await this.chest.findOne(filter).lean();
    }
}
