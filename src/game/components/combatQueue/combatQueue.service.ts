import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_BEFORE_STATUS_ATTACH } from 'src/game/constants';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { JsonStatus } from 'src/game/status/interfaces';
import { StatusGenerator } from 'src/game/status/statusGenerator';
import { Context, ExpeditionEntity } from '../interfaces';
import { CombatQueueTargetEffectTypeEnum } from './combatQueue.enum';
import { CreateCombatQueueDTO, PushActionDTO } from './combatQueue.interface';
import { CombatQueue, CombatQueueDocument } from './combatQueue.schema';
import * as cliColor from 'cli-color';

@Injectable()
export class CombatQueueService {
    private readonly logger = new Logger(CombatQueueService.name);

    constructor(
        @InjectModel(CombatQueue.name)
        private readonly combatQueue: Model<CombatQueueDocument>,
    ) {}

    async start(ctx: Context): Promise<void> {
        await this.create({
            clientId: ctx.client.id,
            queue: [],
        });
    }

    async create(payload: CreateCombatQueueDTO): Promise<CombatQueueDocument> {
        return await this.combatQueue.create(payload);
    }

    async deleteCombatQueueByClientId(clientId: string): Promise<void> {
        await this.combatQueue.deleteMany({ clientId });
    }

    async push(dto: PushActionDTO): Promise<void> {
        const { ctx, source, target, args } = dto;

        await this.combatQueue.findOneAndUpdate(
            {
                clientId: ctx.client.id,
            },
            {
                $push: {
                    queue: {
                        originType: source.type,
                        originId: source.value.id,
                        targets: [
                            {
                                targetType: target.type,
                                targetId: target.value.id,
                                ...args,
                            },
                        ],
                    },
                },
            },
        );
    }

    async end(ctx: Context): Promise<void> {
        const { client } = ctx;

        const combatQueues = await this.combatQueue.findOne({
            clientId: client.id,
        });

        if (!combatQueues) return;

        const data = combatQueues.queue.map(
            ({ originType, originId, targets }) => {
                return { originType, originId, targets };
            },
        );

        this.logger.debug(cliColor.blue('Sending combat queue to client 📮'));
        this.logger.debug(
            cliColor.blue(JSON.stringify(combatQueues.queue, null, 2)),
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.CombatQueue,
                    data,
                }),
            ),
        );

        await this.deleteCombatQueueByClientId(client.id);
    }

    @OnEvent(EVENT_BEFORE_STATUS_ATTACH, { async: true, promisify: true })
    async onAttachStatus(args: {
        ctx: Context;
        source: ExpeditionEntity;
        target: ExpeditionEntity;
        status: JsonStatus;
    }): Promise<void> {
        const { ctx, source, target, status } = args;

        const statusInfo = {
            name: status.name,
            counter: status.args.value,
            description: StatusGenerator.generateDescription(
                status.name,
                status.args.value,
            ),
        };

        return this.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Status,
                healthDelta: 0,
                finalHealth: 0,
                defenseDelta: 0,
                finalDefense: 0,
                statuses: [statusInfo],
            },
        });
    }
}
