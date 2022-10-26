import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trinket, TrinketDocument } from './trinket.schema';
import { StrongCoffeeTrinket } from './data/strongCoffee.trinket';

@Injectable()
export class TrinketSeeder implements Seeder {
    constructor(
        @InjectModel(Trinket.name)
        private readonly trinket: Model<TrinketDocument>,
    ) {}

    async seed(): Promise<any> {
        return this.trinket.insertMany([StrongCoffeeTrinket]);
    }

    async drop(): Promise<any> {
        return this.trinket.deleteMany({});
    }
}
