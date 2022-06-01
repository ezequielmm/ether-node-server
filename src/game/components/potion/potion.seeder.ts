import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Potion, PotionDocument } from './potion.schema';
import { Model } from 'mongoose';

@Injectable()
export class PotionSeeder implements Seeder {
    constructor(
        @InjectModel(Potion.name)
        private readonly potion: Model<PotionDocument>,
    ) {}

    async seed(): Promise<any> {
        const potions = DataFactory.createForClass(Potion).generate(15);
        return this.potion.insertMany(potions);
    }

    async drop(): Promise<any> {
        return this.potion.deleteMany({});
    }
}
