import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';
import { Model } from 'mongoose';
import { Chest, ChestDocument } from './chest.schema';
import { SmallChest } from './data/small.chest';
import { MediumChest } from './data/medium.chest';
import { LargeChest } from './data/large.chest';

@Injectable()
export class ChestSeeder implements Seeder {
    constructor(
        @InjectModel(Chest.name) private readonly chest: Model<ChestDocument>,
    ) {}

    async seed(): Promise<any> {
        return this.chest.insertMany([SmallChest, MediumChest, LargeChest]);
    }

    async drop(): Promise<any> {
        return this.chest.deleteMany({});
    }
}
