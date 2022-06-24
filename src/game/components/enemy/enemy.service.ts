import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Enemy, EnemyDocument } from './enemy.schema';
import { Model } from 'mongoose';

@Injectable()
export class EnemyService {
    constructor(
        @InjectModel(Enemy.name) private readonly enemy: Model<EnemyDocument>,
    ) {}

    public async findByCustomId(enemyId: string): Promise<Enemy> {
        return this.enemy.findOne({ enemyId }).lean();
    }
}
