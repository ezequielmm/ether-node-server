import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getRandomItemByWeight } from 'src/utils';
import { Chest, ChestDocument } from './chest.schema';

@Injectable()
export class ChestService {
    constructor(
        @InjectModel(Chest.name) private readonly chest: Model<ChestDocument>,
    ) {}

    async getRandomChest(): Promise<Chest> {
        const chests = await this.chest.find({}).lean();

        return getRandomItemByWeight<Chest>(
            chests.map((chest) => chest),
            chests.map(({ chance }) => chance),
        );
    }

    async findOne(filter: FilterQuery<ChestDocument>): Promise<Chest> {
        return await this.chest.findOne(filter).lean();
    }
}
