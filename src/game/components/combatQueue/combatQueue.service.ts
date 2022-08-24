import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import {
    CreateCombatQueueDTO,
    ICombatQueueTarget,
} from './combatQueue.interface';
import { CombatQueue, CombatQueueDocument } from './combatQueue.schema';

@Injectable()
export class CombatQueueService {
    constructor(
        @InjectModel(CombatQueue.name)
        private readonly combatQueue: Model<CombatQueueDocument>,
    ) {}

    async create(payload: CreateCombatQueueDTO): Promise<CombatQueueDocument> {
        return await this.combatQueue.create(payload);
    }

    async findAllByClientId(clientId: string): Promise<CombatQueue[]> {
        return await this.combatQueue.find({ clientId }).lean();
    }

    async findById(id: string): Promise<CombatQueue> {
        return await this.combatQueue.findById(id).lean();
    }

    async deleteCombatQueueByClientId(clientId: string): Promise<void> {
        await this.combatQueue.deleteMany({ clientId });
    }

    async addTargetsToCombatQueue(
        combatQueueId: string,
        targets: ICombatQueueTarget[],
    ): Promise<void> {
        await this.combatQueue.findByIdAndUpdate(combatQueueId, {
            $push: {
                targets: {
                    $each: targets,
                },
            },
        });
    }

    async sendQueueToClient(client: Socket): Promise<void> {
        const combatQueues = await this.combatQueue.find({
            clientId: client.id,
        });

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.CombatQueue,
                    data: combatQueues.map(
                        ({ originType, originId, targets }) => {
                            return { originType, originId, targets };
                        },
                    ),
                }),
            ),
        );
    }
}
