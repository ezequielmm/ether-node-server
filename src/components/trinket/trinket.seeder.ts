import { Injectable } from '@nestjs/common';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trinket, TrinketDocument } from './trinket.schema';

@Injectable()
export class TrinketSeeder implements Seeder {
    constructor(
        @InjectModel(Trinket.name)
        private readonly trinket: Model<TrinketDocument>,
    ) {}

    async seed(): Promise<any> {
        const trinkets = DataFactory.createForClass(Trinket).generate(5);
        return this.trinket.insertMany(trinkets);
    }

    async drop(): Promise<any> {
        return this.trinket.deleteMany({});
    }
}
