import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Enemy, EnemyDocument } from './enemy.schema';
import { Model } from 'mongoose';
import { EnemyId } from './enemy.type';

@Injectable()
export class EnemyService {
    constructor(
        @InjectModel(Enemy.name) private readonly enemy: Model<EnemyDocument>,
    ) {}

    public async findById(enemyId: EnemyId): Promise<EnemyDocument> {
        return typeof enemyId === 'string'
            ? this.enemy.findById(enemyId).lean()
            : this.enemy.findOne({ enemyId }).lean();
    }
}
