import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { cloneDeep, compact, filter, find, matches } from 'lodash';
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
import { Context, ExpeditionEntity } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { EffectDTO } from '../effects/effects.interface';
import { ProviderContainer } from '../provider/interfaces';
import { ProviderService } from '../provider/provider.service';
import { STATUS_METADATA_KEY } from './contants';
import {
    AttachedStatus,
    AttachDTO,
    EnemyReferenceDTO,
    JsonStatus,
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
    StatusEventType,
    StatusHandler,
    StatusMetadata,
    StatusStartsAt,
    StatusTrigger,
    OnAttachStatusEventArgs,
} from './interfaces';

@Injectable()
export class StatusService {
    private readonly logger: Logger = new Logger(StatusService.name);
    private handlers: ProviderContainer<StatusMetadata, StatusHandler>[];

    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly providerService: ProviderService,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => PlayerService))
        private readonly playerService: PlayerService,
        @Inject(forwardRef(() => EnemyService))
        private readonly enemyService: EnemyService,
    ) {}

    /**
     * Attach the statuses to the designated entities based on
     * the property *attachTo* of each status.
     *
     * @param {Object} dto Dto parameters
     */
    public async attach(dto: AttachDTO): Promise<void> {
        const { ctx, statuses, source: source, targetId } = dto;

        for (const status of statuses) {
            const targets = this.expeditionService.getEntitiesByType(
                ctx,
                status.args.attachTo,
                source,
                targetId,
            );

            for (const target of targets) {
                const args: OnAttachStatusEventArgs = {
                    status,
                    targetId,
                };

                await this.trigger(ctx, StatusEventType.OnAttachStatus, args);

                switch (target.type) {
                    case CardTargetedEnum.Player:
                        await this.playerService.attach(
                            ctx,
                            source,
                            status.name,
                            status.args,
                        );
                        break;
                    case CardTargetedEnum.Enemy:
                        await this.enemyService.attach(
                            ctx,
                            targetId,
                            source,
                            status.name,
                            status.args,
                        );
                        break;
                }
            }
        }
    }

    public async mutate(dto: MutateEffectArgsDTO): Promise<EffectDTO> {
        const { ctx, collectionOwner, collection, effect, preview } = dto;
        const { expedition } = ctx;
        const {
            currentNode: {
                data: { round },
            },
        } = expedition;
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

                const metadata = container.metadata;
                const instance = container.instance as StatusEffectHandler;

                const isActive = this.isActive(
                    metadata.status.startsAt,
                    status.addedInRound,
                    round,
                );

                if (!isActive) continue;

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
            }
            if (statusesToRemove.length > 0) {
                collection[type] = statuses.filter(
                    (status) => !statusesToRemove.includes(status),
                );
            }
        }

        if (isUpdate)
            await this.updateStatuses(collectionOwner, expedition, collection);

        return effectDTO;
    }

    public findEffectStatuses(
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
        source: ExpeditionEntity,
        expedition: Expedition,
        collection: StatusCollection,
    ) {
        if (PlayerService.isPlayer(source)) {
            await this.updatePlayerStatuses(expedition, collection);
        } else if (EnemyService.isEnemy(source)) {
            await this.updateEnemyStatuses(expedition, source, collection);
        }
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
        ctx: Context,
        event: StatusEventType,
        args = {},
    ): Promise<void> {
        const { expedition } = ctx;
        const { currentNode } = expedition;

        const statusGlobalCollection = await this.getAll(ctx);

        for (const entityCollection of statusGlobalCollection) {
            let isUpdate = false;
            const collection = cloneDeep(entityCollection.statuses);

            for (const type in collection) {
                const statuses = collection[type];
                const statusesToRemove: Status[] = [];
                for (const status of statuses) {
                    const container = this.findHandlerContainer<
                        StatusEvent,
                        StatusEventHandler
                    >({
                        name: status.name,
                        trigger: StatusTrigger.Event,
                        event,
                    });

                    if (!container) continue;

                    const metadata = container.metadata;
                    const instance = container.instance;

                    const isActive = this.isActive(
                        metadata.status.startsAt,
                        status.addedInRound,
                        currentNode.data.round,
                    );

                    if (!isActive) continue;

                    const source = this.getSourceFromReference(
                        expedition,
                        status.sourceReference,
                    );

                    const dto: StatusEventDTO = {
                        ctx,
                        source,
                        target: entityCollection.target,
                        status,
                        args,
                        update(args) {
                            status.args = args;
                            isUpdate = true;
                        },
                        remove() {
                            statusesToRemove.push(status);
                            isUpdate = true;
                        },
                    };

                    await instance.enemyHandler(dto);
                }

                if (statusesToRemove.length > 0) {
                    collection[type] = statuses.filter(
                        (status) => !statusesToRemove.includes(status),
                    );
                }
            }
            if (isUpdate)
                await this.updateStatuses(
                    entityCollection.target,
                    expedition,
                    collection,
                );
        }
    }

    private isActive(
        startsAt: StatusStartsAt,
        addedInRound: number,
        currentRound: number,
    ): boolean {
        return !(
            startsAt == StatusStartsAt.NextTurn && addedInRound == currentRound
        );
    }

    private convertStatusToAttached(
        jsonStatus: JsonStatus,
        currentRound: number,
        sourceReference: EntityReferenceDTO,
    ): {
        status: AttachedStatus;
        container: ProviderContainer<StatusMetadata, StatusHandler>;
    } {
        const container = this.findHandlerContainer({ name: jsonStatus.name });

        if (!container)
            throw new Error(`Status ${jsonStatus.name} does not exist`);

        const status: AttachedStatus = {
            name: jsonStatus.name,
            addedInRound: currentRound,
            sourceReference,
            args: {
                value: jsonStatus.args.value,
            },
        };

        return {
            status,
            container,
        };
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

    getAll(ctx: Context): StatusesGlobalCollection {
        const { expedition } = ctx;
        const collection: StatusesGlobalCollection = [];

        collection.push({
            target: {
                type: CardTargetedEnum.Player,
                value: {
                    globalState: expedition.playerState,
                    combatState: expedition.currentNode.data.player,
                },
            },
            statuses: expedition.currentNode.data.player.statuses,
        });

        collection.push(...this.getAllFromEnemies(ctx));

        return collection;
    }

    private getAllFromEnemies(ctx: Context): StatusesGlobalCollection {
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

    getAllByName(ctx: Context, name: string): StatusesGlobalCollection {
        const global = this.getAll(ctx);
        const statuses: StatusesGlobalCollection = [];

        statuses.push(...filter(global, { statuses: { buff: [{ name }] } }));
        statuses.push(...filter(global, { statuses: { debuff: [{ name }] } }));

        return compact(statuses);
    }
}
