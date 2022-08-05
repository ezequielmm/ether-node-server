import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CreateAttackQueueDTO,
    FilterAttackQueueDTO,
    UpdateAttackQueueDTO,
} from './attackQueue.interface';
import { AttackQueue, AttackQueueDocument } from './attackQueue.schema';

@Injectable()
export class AttackQueueService {
    constructor(
        @InjectModel(AttackQueue.name)
        private readonly attackQueue: Model<AttackQueueDocument>,
    ) {}

    async create(payload: CreateAttackQueueDTO): Promise<AttackQueueDocument> {
        return await this.attackQueue.create(payload);
    }

    async findOne(filters: FilterAttackQueueDTO): Promise<AttackQueueDocument> {
        return await this.attackQueue.findOne(filters).lean();
    }

    async update(
        filters: FilterAttackQueueDTO,
        payload: UpdateAttackQueueDTO,
    ): Promise<AttackQueueDocument> {
        return await this.attackQueue.findOneAndUpdate(filters, payload, {
            new: true,
        });
    }

    async delete(filters: FilterAttackQueueDTO): Promise<AttackQueueDocument> {
        const attackQueue = await this.attackQueue.findOneAndDelete(filters);

        if (!attackQueue)
            throw new NotFoundException(
                `This expedition does not have an attack queue created`,
            );

        return attackQueue;
    }
}
