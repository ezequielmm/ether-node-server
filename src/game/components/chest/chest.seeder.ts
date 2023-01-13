import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Seeder } from 'nestjs-seeder';
import { Chest } from './chest.schema';
import { SmallChest } from './data/small.chest';
import { MediumChest } from './data/medium.chest';
import { LargeChest } from './data/large.chest';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class ChestSeeder implements Seeder {
    constructor(
        @InjectModel(Chest)
        private readonly chest: ReturnModelType<typeof Chest>,
    ) {}

    async seed(): Promise<any> {
        return this.chest.insertMany([SmallChest, MediumChest, LargeChest]);
    }

    async drop(): Promise<any> {
        return this.chest.deleteMany({});
    }
}
