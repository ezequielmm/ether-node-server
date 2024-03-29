import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from 'kindagoose';
import { Enemy } from './enemy.schema';
import { data } from './enemy.data';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class EnemySeeder implements Seeder {
    constructor(
        @InjectModel(Enemy)
        private readonly enemy: ReturnModelType<typeof Enemy>,
    ) {}

    async seed(): Promise<any> {
        return await this.enemy.insertMany(data);
    }

    async drop(): Promise<any> {
        return await this.enemy.deleteMany({});
    }
}
