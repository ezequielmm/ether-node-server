import { Injectable, Logger } from '@nestjs/common';
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
    AttachToEnemyDTO,
    AttachToPlayerDTO,
    EnemyReferenceDTO,
    JsonStatus,
    MutateEffectArgsDTO,
    PlayerReferenceDTO,
    SourceEntityReferenceDTO,
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
        private readonly expeditionService: ExpeditionService,
    ) {}

    // TODO: Move to EnemyService
    private async attachToEnemy(dto: AttachToEnemyDTO): Promise<void> {
        const { ctx, enemyId, status, currentRound } = dto;

        const { status: attachedStatus, container: provider } =
            this.convertStatusToAttached(
                status,
                currentRound,
                dto.sourceReference,
            );

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                [`currentNode.data.enemies.${enemyIdField(enemyId)}`]: enemyId,
            },
            {
                $push: {
                    [`currentNode.data.enemies.$.statuses.${provider.metadata.status.type}`]:
                        attachedStatus,
                },
            },
        );

        this.logger.debug(`Attached status ${status.name} to enemy ${enemyId}`);
    }

    // TODO: Move to PlayService
    private async attachToPlayer(dto: AttachToPlayerDTO): Promise<void> {
        const { ctx, status, currentRound } = dto;

        const { status: attachedStatus, container: provider } =
            this.convertStatusToAttached(
                status,
                currentRound,
                dto.sourceReference,
            );

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
            },
            {
                $push: {
                    [`currentNode.data.player.statuses.${provider.metadata.status.type}`]:
                        attachedStatus,
                },
            },
        );

        this.logger.debug(`Attached status ${status.name} to player`);
    }

    public async attach(dto: AttachDTO): Promise<void> {
        const { ctx, statuses, currentRound, sourceReference, targetId } = dto;

        for (const status of statuses) {
            const args: OnAttachStatusEventArgs = {
                status,
                targetId,
            };
            await this.trigger(ctx, StatusEventType.OnAttachStatus, args);
            // TODO: Add attachTo.Self case
            switch (status.args.attachTo) {
                case CardTargetedEnum.Player:
                    await this.attachToPlayer({
                        ctx,
                        sourceReference,
                        status,
                        currentRound,
                    });
                    break;
                case CardTargetedEnum.Enemy:
                    await this.attachToEnemy({
                        ctx,
                        status,
                        sourceReference,
                        enemyId: targetId,
                        currentRound,
                    });
                    break;
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
        sourceReference: SourceEntityReferenceDTO,
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

    private isPlayerReference(
        reference: SourceEntityReferenceDTO,
    ): reference is PlayerReferenceDTO {
        return reference.type == CardTargetedEnum.Player;
    }

    private isEnemyReference(
        reference: SourceEntityReferenceDTO,
    ): reference is EnemyReferenceDTO {
        return reference.type == CardTargetedEnum.Enemy;
    }

    public getSourceFromReference(
        expedition: Expedition,
        reference: SourceEntityReferenceDTO,
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

    public getReferenceFromSource(
        source: ExpeditionEntity,
    ): SourceEntityReferenceDTO {
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
