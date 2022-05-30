import { Injectable } from '@nestjs/common';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Enemy, EnemyDocument } from './enemy.schema';
import { Model } from 'mongoose';
import { data } from './enemy.seeder.data';
@Injectable()
export class EnemySeeder implements Seeder {
    constructor(
        @InjectModel(Enemy.name) private readonly enemy: Model<EnemyDocument>,
    ) {}

    async seed(): Promise<any> {
        // const enemies = DataFactory.createForClass(Enemy).generate(10);
        return this.enemy.insertMany(data);
    }

    async drop(): Promise<any> {
        return this.enemy.deleteMany({});
    }
}
