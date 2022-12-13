import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReturnModelType } from '@typegoose/typegoose';
import { isEmpty } from 'lodash';
import { InjectModel } from 'kindagoose';
import {
    EVENT_AFTER_STATUSES_UPDATE,
    EVENT_AFTER_STATUS_ATTACH
} from 'src/game/constants';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType
} from 'src/game/standardResponse/standardResponse';
import { AttachedStatus } from 'src/game/status/interfaces';
import {
    IStatusesList,
    StatusGenerator
} from 'src/game/status/statusGenerator';
import { ExpeditionEntity, GameContext } from '../interfaces';
import { PlayerService } from '../player/player.service';
import { CombatQueueTargetEffectTypeEnum } from './combatQueue.enum';
import { CreateCombatQueueDTO, PushActionDTO } from './combatQueue.interface';
import { CombatQueue } from './combatQueue.schema';

@Injectable()
export class CombatQueueService {
    private readonly logger = new Logger(CombatQueueService.name);

    constructor(
        @InjectModel(CombatQueue)
        private readonly combatQueue: ReturnModelType<typeof CombatQueue>,
    ) { }

    async findByClientId(clientId: string): Promise<CombatQueue> {
        return await this.combatQueue.findOne({ clientId });
    }

    async start(ctx: GameContext): Promise<void> {
        await this.create({
            clientId: ctx.client.id,
            queue: [],
        });
    }

    async create(payload: CreateCombatQueueDTO): Promise<CombatQueue> {
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

        statusesInfo.push(...StatusGenerator.formatStatusesToArray(statuses));

        if (statusesInfo.length > 0) {
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
}
