import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { EnemyGroup, EnemyGroupDocument } from './enemyGroups.schema';
import { Model } from 'mongoose';
import { enemiesDataSeed } from './enemyGroup.data';

@Injectable()
export class EnemyGroupSeeder implements Seeder {
    constructor(
        @InjectModel(EnemyGroup.name)
        private readonly enemyGroup: Model<EnemyGroupDocument>,
    ) {}

    async seed(): Promise<any> {
        return this.enemyGroup.insertMany(enemiesDataSeed);
    }

    async drop(): Promise<any> {
        return this.enemyGroup.deleteMany({});
    }
}
