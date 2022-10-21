import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    EVENT_AFTER_STATUSES_UPDATE,
    EVENT_AFTER_STATUS_ATTACH,
} from 'src/game/constants';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { AttachedStatus } from 'src/game/status/interfaces';
import {
    IStatusesList,
    StatusGenerator,
} from 'src/game/status/statusGenerator';
import { GameContext, ExpeditionEntity } from '../interfaces';
import { CombatQueueTargetEffectTypeEnum } from './combatQueue.enum';
import { CreateCombatQueueDTO, PushActionDTO } from './combatQueue.interface';
import { CombatQueue, CombatQueueDocument } from './combatQueue.schema';
import { isEmpty } from 'lodash';
import { PlayerService } from '../player/player.service';

@Injectable()
export class CombatQueueService {
    private readonly logger = new Logger(CombatQueueService.name);

    constructor(
        @InjectModel(CombatQueue.name)
        private readonly combatQueue: Model<CombatQueueDocument>,
    ) {}

    async start(ctx: GameContext): Promise<void> {
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

    async end(ctx: GameContext): Promise<void> {
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

        // Avoid sending empty combat queue to client
        if (isEmpty(data)) return;

        this.logger.log(`Sending combat queue to client ${client.id}`);

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.CombatUpdate,
                action: SWARAction.CombatQueue,
                data,
            }),
        );

        // Clear combat queue
        await this.deleteCombatQueueByClientId(client.id);
    }

    @OnEvent(EVENT_AFTER_STATUS_ATTACH)
    async onAttachStatus(args: {
        ctx: GameContext;
        source: ExpeditionEntity;
        target: ExpeditionEntity;
    }): Promise<void> {
        await this.addStatusesToCombatQueue(args);
    }

    @OnEvent(EVENT_AFTER_STATUSES_UPDATE)
    async onStatusesUpdate(args: {
        ctx: GameContext;
        source: ExpeditionEntity;
        target: ExpeditionEntity;
    }): Promise<void> {
        await this.addStatusesToCombatQueue(args);
    }

    private async addStatusesToCombatQueue(args: {
        ctx: GameContext;
        source: ExpeditionEntity;
        target: ExpeditionEntity;
    }) {
        const { ctx, source, target } = args;

        const statuses = PlayerService.isPlayer(target)
            ? target.value.combatState.statuses
            : target.value.statuses;

        await this.pushStatuses(ctx, source, target, [
            ...statuses.buff,
            ...statuses.debuff,
        ]);
    }

    public async pushStatuses(
        ctx: GameContext,
        source: ExpeditionEntity,
        target: ExpeditionEntity,
        statuses: AttachedStatus[],
    ): Promise<void> {
        const statusesInfo: IStatusesList[] = [];
        for (const status of statuses) {
            statusesInfo.push({
                name: status.name,
                counter: status.args.counter,
                description: StatusGenerator.generateDescription(
                    status.name,
                    status.args.counter,
                ),
            });
        }

        await this.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Status,
                healthDelta: 0,
                finalHealth: 0,
                defenseDelta: 0,
                finalDefense: 0,
                statuses: statusesInfo,
            },
        });
    }
}
