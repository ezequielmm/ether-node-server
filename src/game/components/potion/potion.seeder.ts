import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';
import { Potion, PotionDocument } from './potion.schema';
import { Model } from 'mongoose';
import { healingPotion } from './data/healing.potion';
import { defensePotion } from './data/defense.potion';
import { springWaterFlask } from './data/springWaterFlask.potion';
import { spiritElixir } from './data/spiritElixir.potion';
import { potionOfLevitation } from './data/potion0fLevitation.potion';
import { ichorDraft } from './data/IchorDraft.potion';

@Injectable()
export class PotionSeeder implements Seeder {
    constructor(
        @InjectModel(Potion.name)
        private readonly potion: Model<PotionDocument>,
    ) {}

    async seed(): Promise<any> {
        return this.potion.insertMany([
            healingPotion,
            defensePotion,
            springWaterFlask,
            spiritElixir,
            potionOfLevitation,
            ichorDraft,
        ]);
    }

    async drop(): Promise<any> {
        return this.potion.deleteMany({});
    }
}
