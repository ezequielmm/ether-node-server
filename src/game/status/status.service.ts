import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from 'nestjs-typegoose';
import {
    compact,
    filter,
    find,
    isArray,
    matches,
    reject,
    isEqual,
} from 'lodash';
import { Model } from 'mongoose';
import { CardTargetedEnum } from '../components/card/card.enum';
import { ExpeditionEnemy } from '../components/enemy/enemy.interface';
import { EnemyService } from '../components/enemy/enemy.service';
import { enemyIdField } from '../components/enemy/enemy.type';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import {
    Expedition,
    ExpeditionDocument,
} from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext, ExpeditionEntity } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import {
    EVENT_AFTER_STATUSES_UPDATE,
    EVENT_AFTER_STATUS_ATTACH,
    EVENT_BEFORE_STATUS_ATTACH,
} from '../constants';
import { EffectDTO } from '../effects/effects.interface';
import { ProviderContainer } from '../provider/interfaces';
import { ProviderService } from '../provider/provider.service';
import { STATUS_METADATA_KEY } from './contants';
import {
    AttachAllDTO,
    EnemyReferenceDTO,
    MutateEffectArgsDTO,
    PlayerReferenceDTO,
    EntityReferenceDTO,
    Status,
    StatusCollection,
    StatusDirection,
    StatusEffect,
    StatusEffectHandler,
    StatusesGlobalCollection,
    StatusEvent,
    StatusEventDTO,
    StatusEventHandler,
    StatusHandler,
    StatusMetadata,
    StatusTrigger,
    AttachedStatus,
    AttachDTO,
    BeforeStatusAttachEvent,
} from './interfaces';
import * as cliColor from 'cli-color';
import { TargetId } from '../effects/effects.types';
import { ReturnModelType } from '@typegoose/typegoose';

export interface AfterStatusAttachEvent {
    ctx: GameContext;
    target: ExpeditionEntity;
    targetId: TargetId;
    source: ExpeditionEntity;
    status: AttachedStatus;
}
export interface AfterStatusesUpdateEvent {
    ctx: GameContext;
    source: ExpeditionEntity;
    target: ExpeditionEntity;
    collection: StatusCollection;
}

@Injectable()
export class StatusService {
    private readonly logger: Logger = new Logger(StatusService.name);
    private handlers: ProviderContainer<StatusMetadata, StatusHandler>[];

    constructor(
        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,
        private readonly providerService: ProviderService,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => PlayerService))
        private readonly playerService: PlayerService,
        @Inject(forwardRef(() => EnemyService))
        private readonly enemyService: EnemyService,
        private readonly eventEmitter: EventEmitter2,
    ) {
        // Use event emitter to listen to events and trigger the handlers
        this.eventEmitter.onAny(async (event, args) => {
            const { ctx, ...rest } = args;

            // Check if the event is array of events
            const events = isArray(event) ? event : [event];

            // If CTX, trigger event on events
            if (ctx) {
                ctx.events.emit(events, rest);
            }

            // Loop through the events and trigger the handlers
            for (const event of events) {
                await this.trigger(ctx, event, rest);
            }
        });
    }

    /**
     * Attach the statuses to the designated entities based on
     * the property *attachTo* of each status.
     *
     * @param {Object} dto Dto parameters
     */
    public async attachAll(dto: AttachAllDTO): Promise<void> {
        const { ctx, statuses, source, targetId } = dto;

        for (const status of statuses) {
            const { attachTo } = status;
            const targets = this.expeditionService.getEntitiesByType(
                ctx,
                attachTo,
                source,
                targetId,
            );

            for (const target of targets) {
                await this.attach({
                    ctx,
                    source,
                    target,
                    statusName: status.name,
                    statusArgs: status.args,
                });
            }
        }
    }

    /**
     * Attach the status to the designated entity.
     * This method will trigger the event *beforeStatusAttach* and *afterStatusAttach*
     * before and after the status is attached.
     *
     * @param dto Dto parameters
     */
    public async attach(dto: AttachDTO) {
        const { ctx, source, target, statusName, statusArgs } = dto;

        const eventBeforeStatusAttach: BeforeStatusAttachEvent = {
            ctx,
            source,
            target,
            status: {
                name: statusName,
                args: statusArgs,
            },
            targetId: target.value.id,
        };
        await this.eventEmitter.emitAsync(
            EVENT_BEFORE_STATUS_ATTACH,
            eventBeforeStatusAttach,
        );

        let finalStatus: AttachedStatus;
        switch (target.type) {
            case CardTargetedEnum.Player:
                finalStatus = await this.playerService.attach(
                    ctx,
                    source,
                    statusName,
                    statusArgs,
                );
                break;
            case CardTargetedEnum.Enemy:
                finalStatus = await this.enemyService.attach(
                    ctx,
                    target.value.id,
                    source,
                    statusName,
                    statusArgs,
                );
                break;
        }

        const afterStatusAttachEvent: AfterStatusAttachEvent = {
            ctx,
            source,
            status: finalStatus,
            target,
            targetId: target.value.id,
        };

        await this.eventEmitter.emitAsync(
            EVENT_AFTER_STATUS_ATTACH,
            afterStatusAttachEvent,
        );
    }

    public async mutate(dto: MutateEffectArgsDTO): Promise<EffectDTO> {
        const { ctx, collectionOwner, collection, effect, preview } = dto;
        let { effectDTO } = dto;
        let isUpdate = false;

        for (const type in collection) {
            const statuses = collection[type];
            const statusesToRemove: Status[] = [];
            for (const status of statuses) {
                const container = this.findHandlerContainer<
                    StatusEffect,
                    StatusEffectHandler
                >({
                    name: status.name,
                    trigger: StatusTrigger.Effect,
                    effects: [{ name: effect }],
                });

                if (!container) continue;

                const instance = container.instance as StatusEffectHandler;

                effectDTO = await instance[preview ? 'preview' : 'handle']({
                    ctx,
                    effectDTO,
                    status: status,
                    update(args) {
                        status.args = args;
                        isUpdate = true;
                    },
                    remove() {
                        statusesToRemove.push(status);
                        isUpdate = true;
                    },
                });

                this.logger.debug(
                    `Mutating effect ${effect} with status ${status.name} | ${effectDTO.args.initialValue} ➭ ${effectDTO.args.currentValue}`,
                );
            }
            if (statusesToRemove.length > 0) {
                collection[type] = statuses.filter(
                    (status) => !statusesToRemove.includes(status),
                );
            }
        }

        if (isUpdate)
            await this.updateStatuses(ctx, collectionOwner, collection);

        return effectDTO;
    }

    public findStatusesByDirection(
        entity: ExpeditionEntity,
        direction: StatusDirection,
    ): StatusCollection {
        let statuses: StatusCollection;
        if (PlayerService.isPlayer(entity)) {
            statuses = entity.value.combatState.statuses;
        } else if (EnemyService.isEnemy(entity)) {
            statuses = entity.value.statuses;
        }

        if (!statuses) {
            throw new Error(`Could not find statuses for ${entity.type}`);
        }

        return this.filterCollectionByDirection(statuses, direction);
    }

    public filterCollectionByDirection(
        collection: StatusCollection,
        direction: StatusDirection,
    ): StatusCollection {
        const filter = (status) => {
            const container = this.findHandlerContainer<
                StatusEffect,
                StatusEffectHandler
            >({
                name: status.name,
                trigger: StatusTrigger.Effect,
            });

            if (!container) return false;

            return container.metadata.status.direction === direction;
        };

        return {
            buff: collection.buff.filter(filter),
            debuff: collection.debuff.filter(filter),
        };
    }

    public async updateStatuses(
        ctx: GameContext,
        target: ExpeditionEntity,
        collection: StatusCollection,
    ) {
        const { expedition } = ctx;

        if (PlayerService.isPlayer(target)) {
            await this.updatePlayerStatuses(expedition, collection);
        } else if (EnemyService.isEnemy(target)) {
            await this.updateEnemyStatuses(expedition, target, collection);
        }

        const afterStatusesUpdateEvent: AfterStatusesUpdateEvent = {
            ctx,
            source: target,
            target,
            collection,
        };

        await this.eventEmitter.emitAsync(
            EVENT_AFTER_STATUSES_UPDATE,
            afterStatusesUpdateEvent,
        );
    }

    public async updateEnemyStatuses(
        expedition: Expedition,
        source: ExpeditionEnemy,
        collection: StatusCollection,
    ): Promise<void> {
        await this.expedition
            .findOneAndUpdate(
                {
                    clientId: expedition.clientId,
                    status: ExpeditionStatusEnum.InProgress,
                    [`currentNode.data.enemies.${enemyIdField(
                        source.value.id,
                    )}`]: source.value.id,
                },
                {
                    $set: {
                        'currentNode.data.enemies.$.statuses': collection,
                    },
                },
            )
            .lean();
    }

    public async updatePlayerStatuses(
        expedition: Expedition,
        collection: StatusCollection,
    ): Promise<void> {
        return this.expedition
            .findOneAndUpdate(
                {
                    clientId: expedition.clientId,
                    status: ExpeditionStatusEnum.InProgress,
                },
                {
                    'currentNode.data.player.statuses': collection,
                },
            )
            .lean();
    }

    public async trigger(
        ctx: GameContext,
        event: string,
        args = {},
    ): Promise<void> {
        const { expedition } = ctx;
        const statusGlobalCollection = await this.getAll(ctx);

        for (const entityCollection of statusGlobalCollection) {
            let isUpdate = false;
            const collection = entityCollection.statuses;

            for (const type in collection) {
                const statuses = collection[type];
                const statusesToRemove: Status[] = [];
                for (const status of statuses) {
                    const container =
                        this.findHandlerContainer<
                            StatusEvent,
                            StatusEventHandler
                        >({
                            name: status.name,
                            trigger: StatusTrigger.Event,
                            // Find all handlers that match the unique event name
                            event,
                        }) ||
                        this.findHandlerContainer<
                            StatusEvent,
                            StatusEventHandler
                        >({
                            name: status.name,
                            trigger: StatusTrigger.Event,
                            // Find all handlers that match the event name in array of events
                            event: [event],
                        });

                    if (!container) continue;

                    const instance = container.instance;

                    const source = this.getSourceFromReference(
                        expedition,
                        status.sourceReference,
                    );

                    const dto: StatusEventDTO = {
                        ctx,
                        source,
                        event,
                        target: entityCollection.target,
                        status,
                        eventArgs: args,
                        update(args) {
                            status.args = args;
                            isUpdate = true;
                        },
                        remove() {
                            statusesToRemove.push(status);
                            isUpdate = true;
                        },
                    };

                    await instance.handle(dto);
                }

                if (statusesToRemove.length > 0) {
                    collection[type] = statuses.filter(
                        (status) => !statusesToRemove.includes(status),
                    );
                }
            }
            if (isUpdate)
                await this.updateStatuses(
                    ctx,
                    entityCollection.target,
                    collection,
                );
        }
    }

    public findHandlerContainer<S extends Status, H extends StatusHandler>(
        status: Partial<S>,
    ): ProviderContainer<StatusMetadata<S>, H> {
        this.handlers =
            this.handlers ||
            this.providerService.findByMetadataKey(STATUS_METADATA_KEY);

        const container = find(
            this.handlers,
            matches({
                metadata: {
                    status,
                },
            }),
        );

        return container;
    }

    public getMetadataByName(name: string): StatusMetadata {
        const container = this.findHandlerContainer({ name });

        if (!container) throw new Error(`Status ${name} does not exist`);

        return container.metadata;
    }

    public isStatusEffect(name: string): boolean {
        const metadata = this.getMetadataByName(name);
        return metadata.status.trigger == StatusTrigger.Effect;
    }

    private isPlayerReference(
        reference: EntityReferenceDTO,
    ): reference is PlayerReferenceDTO {
        return reference.type == CardTargetedEnum.Player;
    }

    private isEnemyReference(
        reference: EntityReferenceDTO,
    ): reference is EnemyReferenceDTO {
        return reference.type == CardTargetedEnum.Enemy;
    }

    public getSourceFromReference(
        expedition: Expedition,
        reference: EntityReferenceDTO,
    ): ExpeditionEntity {
        let source: ExpeditionEntity;

        if (this.isPlayerReference(reference)) {
            source = {
                type: CardTargetedEnum.Player,
                value: {
                    id: expedition.playerId,
                    globalState: expedition.playerState,
                    combatState: expedition.currentNode.data.player,
                },
            };
        } else if (this.isEnemyReference(reference)) {
            source = {
                type: CardTargetedEnum.Enemy,
                value: find(expedition.currentNode.data.enemies, [
                    enemyIdField(reference.id),
                    reference.id,
                ]),
            };
        }

        return source;
    }

    // TODO: Move to player and enemy service respectively
    public getReferenceFromEntity(
        source: ExpeditionEntity,
    ): EntityReferenceDTO {
        if (PlayerService.isPlayer(source)) {
            return {
                type: CardTargetedEnum.Player,
            };
        } else if (EnemyService.isEnemy(source)) {
            return {
                type: CardTargetedEnum.Enemy,
                id: source.value.id,
            };
        }
    }

    getAll(ctx: GameContext): StatusesGlobalCollection {
        const { expedition } = ctx;
        const collection: StatusesGlobalCollection = [];

        collection.push({
            target: {
                type: CardTargetedEnum.Player,
                value: {
                    id: expedition.playerId,
                    globalState: expedition.playerState,
                    combatState: expedition.currentNode.data.player,
                },
            },
            statuses: expedition.currentNode.data.player.statuses,
        });

        collection.push(...this.getAllFromEnemies(ctx));

        return collection;
    }

    private getAllFromEnemies(ctx: GameContext): StatusesGlobalCollection {
        const collection: StatusesGlobalCollection = [];
        const { expedition } = ctx;
        for (const enemy of expedition.currentNode.data.enemies) {
            collection.push({
                target: {
                    type: CardTargetedEnum.Enemy,
                    value: enemy,
                },
                statuses: enemy.statuses,
            });
        }
        return collection;
    }

    getAllByName(ctx: GameContext, name: string): StatusesGlobalCollection {
        const global = this.getAll(ctx);
        const statuses: StatusesGlobalCollection = [];

        statuses.push(...filter(global, { statuses: { buff: [{ name }] } }));
        statuses.push(...filter(global, { statuses: { debuff: [{ name }] } }));

        return compact(statuses);
    }

    public async decreaseCounterAndRemove(
        ctx: GameContext,
        collection: StatusCollection,
        entity: ExpeditionEntity,
        status: Status,
    ): Promise<void> {
        const statusCollection = filter(collection[status.type], {
            name: status.name,
        });

        const statusesToRemove = [];

        // If there are no distraughts, return
        if (statusCollection.length === 0) return;

        for (const status of statusCollection) {
            // Decremement the value of the status
            status.args.counter--;

            if (status.args.counter === 0) {
                // If the value is 0, remove the status
                statusesToRemove.push(status);
                this.logger.debug(
                    cliColor.red(`Removing status ${status.name}`),
                );
            } else {
                this.logger.debug(
                    cliColor.red(
                        `Decreasing ${status.name} status value to ${status.args.counter}`,
                    ),
                );
            }
        }

        // Remove the distraughts that are 0
        collection[status.type] = collection[status.type].filter(
            (status) => !statusesToRemove.includes(status),
        );

        // Update the entity
        await this.updateStatuses(ctx, entity, collection);
    }

    public async removeStatus(args: {
        ctx: GameContext;
        entity: ExpeditionEntity;
        status: Status;
    }) {
        const { ctx, entity, status } = args;

        const statuses = PlayerService.isPlayer(entity)
            ? entity.value.combatState.statuses
            : entity.value.statuses;

        const originalStatuses = statuses[status.type];
        const finalStatuses = reject(originalStatuses, {
            name: status.name,
        });

        if (isEqual(finalStatuses, originalStatuses)) {
            return;
        }

        statuses[status.type] = finalStatuses;

        // Update status collection
        this.logger.debug(`Removing status ${status.name} from ${entity.type}`);

        await this.updateStatuses(ctx, entity, statuses);
    }
}
