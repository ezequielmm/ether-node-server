import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import {
    CreateAttackQueueDTO,
    FilterAttackQueueDTO,
    IAttackQueueTarget,
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

    async addTargetToQueue(
        filters: FilterAttackQueueDTO,
        target: IAttackQueueTarget,
    ): Promise<void> {
        await this.attackQueue.findOneAndUpdate(filters, {
            $push: { targets: target },
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

    async sendQueueToClient(
        filters: FilterAttackQueueDTO,
        client: Socket,
    ): Promise<void> {
        const { expeditionId } = filters;

        const attackQueue = await this.attackQueue.findOne({
            expeditionId,
        });

        // If we have an attack queue ready, we get it and send it
        // to the client
        if (attackQueue) {
            // We send the message to the client
            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.CombatUpdate,
                        action: SWARAction.CombatQueue,
                        data: attackQueue.targets,
                    }),
                ),
            );

            // Finally delete the queue for the next time there is an attack
            attackQueue.delete();
        }
    }
}
