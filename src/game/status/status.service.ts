import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { clone, find, matches } from 'lodash';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { getEnemyIdField } from '../components/enemy/enemy.type';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import {
    Expedition,
    ExpeditionDocument,
} from '../components/expedition/expedition.schema';
import { getClientIdField } from '../components/expedition/expedition.type';
import {
    EffectDTO,
    EnemyDTO,
    SourceEntityDTO,
} from '../effects/effects.interface';
import { EffectService } from '../effects/effects.service';
import { TargetId } from '../effects/effects.types';
import { ProviderContainer } from '../provider/interfaces';
import { ProviderService } from '../provider/provider.service';
import { STATUS_METADATA_KEY } from './contants';
import {
    AttachedStatus,
    AttachStatusToEnemyDTO,
    AttachStatusToPlayerDTO,
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
} from './interfaces';

@Injectable()
export class StatusService {
    private handlers: ProviderContainer<StatusMetadata, StatusHandler>[];

    constructor(
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly providerService: ProviderService,
    ) {}

    public async attachStatusToEnemy(
        dto: AttachStatusToEnemyDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, enemyId, status, currentRound } = dto;

        const { status: attachedStatus, container: provider } =
            this.convertStatusToAttached(
                status,
                currentRound,
                dto.sourceReference,
            );

        return this.expedition
            .findOneAndUpdate(
                {
                    [getClientIdField(clientId)]: clientId,
                    status: ExpeditionStatusEnum.InProgress,
                    [`currentNode.data.enemies.${getEnemyIdField(enemyId)}`]:
                        enemyId,
                },
                {
                    $push: {
                        [`currentNode.data.enemies.$.statuses.${provider.metadata.status.type}`]:
                            attachedStatus,
                    },
                },
            )
            .lean();
    }

    public async attachStatusToPlayer(
        dto: AttachStatusToPlayerDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, status, currentRound } = dto;

        const { status: attachedStatus, container: provider } =
            this.convertStatusToAttached(
                status,
                currentRound,
                dto.sourceReference,
            );

        return await this.expedition.findOneAndUpdate(
            {
                clientId,
                status: ExpeditionStatusEnum.InProgress,
            },
            {
                $push: {
                    [`currentNode.data.player.statuses.${provider.metadata.status.type}`]:
                        attachedStatus,
                },
            },
        );
    }

    public async attachStatuses(
        clientId: string,
        statuses: JsonStatus[],
        currentRound: number,
        sourceReference: SourceEntityReferenceDTO,
        targetId?: TargetId,
    ): Promise<void> {
        for (const status of statuses) {
            switch (status.args.attachTo) {
                case CardTargetedEnum.Player:
                    await this.attachStatusToPlayer({
                        clientId,
                        sourceReference,
                        status,
                        currentRound,
                    });
                    break;
                case CardTargetedEnum.Enemy:
                    await this.attachStatusToEnemy({
                        clientId,
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
        const {
            client,
            expedition,
            collectionOwner,
            collection,
            effect,
            effectDTO,
        } = dto;
        let mutatedDTO = clone(effectDTO);
        const {
            currentNode: {
                data: { round },
            },
        } = expedition;
        // Clone the dto to avoid mutating the original
        let isUpdate = false;

        for (const type in collection) {
            const statuses = collection[type];
            for (const status of statuses) {
                const container = this.findHandlerContainer<
                    StatusEffect,
                    StatusEffectHandler
                >({
                    name: status.name,
                    trigger: StatusTrigger.Effect,
                    effects: [{ name: effect }],
                });

                if (!container) {
                    continue;
                }

                const metadata = container.metadata;
                const instance = container.instance as StatusEffectHandler;

                const isActive = this.isActive(
                    metadata.status.startsAt,
                    status.addedInRound,
                    round,
                );

                if (!isActive) continue;

                mutatedDTO = await instance.handle.bind(instance)({
                    client,
                    expedition: expedition,
                    effectDTO: mutatedDTO,
                    status: status,
                    update(args) {
                        const index = statuses.indexOf(status);
                        statuses[index].args = args;
                        isUpdate = true;
                    },
                    remove() {
                        const index = statuses.indexOf(status);
                        statuses.splice(index, 1);
                        isUpdate = true;
                    },
                });
            }
        }

        if (isUpdate) {
            await this.updateStatuses(collectionOwner, expedition, collection);
        }

        return mutatedDTO;
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

            if (!container) {
                return false;
            }

            return container.metadata.status.direction === direction;
        };

        return {
            buff: collection.buff.filter(filter),
            debuff: collection.debuff.filter(filter),
        };
    }

    public async updateStatuses(
        source: SourceEntityDTO,
        expedition: Expedition,
        collection: StatusCollection,
    ) {
        if (EffectService.isPlayer(source)) {
            await this.updatePlayerStatuses(expedition, collection);
        } else if (EffectService.isEnemy(source)) {
            await this.updateEnemyStatuses(expedition, source, collection);
        }
    }

    public async updateEnemyStatuses(
        expedition: Expedition,
        source: EnemyDTO,
        collection: StatusCollection,
    ): Promise<void> {
        return this.expedition
            .findOneAndUpdate(
                {
                    clientId: expedition.clientId,
                    status: ExpeditionStatusEnum.InProgress,
                    [`currentNode.data.enemies.${getEnemyIdField(
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
        client: Socket,
        expedition: Expedition,
        event: StatusEventType,
    ): Promise<void> {
        const currentNode = expedition.currentNode;

        const statusGlobalCollection = await this.findAllStatuses(expedition);

        for (const entityCollection of statusGlobalCollection) {
            let isUpdate = false;
            const collection = entityCollection.statuses;

            for (const type in collection) {
                const statuses = collection[type];
                for (const status of statuses) {
                    const container = this.findHandlerContainer<
                        StatusEvent,
                        StatusEventHandler
                    >({
                        name: status.name,
                        trigger: StatusTrigger.Event,
                        event,
                    });

                    if (!container) {
                        continue;
                    }

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
                        client,
                        expedition,
                        source,
                        target: entityCollection.target,
                        status,
                        update(args) {
                            const index = statuses.indexOf(status);
                            statuses[index].args = args;
                            isUpdate = true;
                        },
                        remove() {
                            const index = statuses.indexOf(status);
                            statuses.splice(index, 1);
                            isUpdate = true;
                        },
                    };

                    await instance.handle.bind(instance)(dto);
                }
            }
            if (isUpdate) {
                await this.updateStatuses(
                    entityCollection.target,
                    expedition,
                    collection,
                );
            }
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

    private findHandlerContainer<S extends Status, H extends StatusHandler>(
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
    ): SourceEntityDTO {
        let source: SourceEntityDTO;

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
                    getEnemyIdField(reference.id),
                    reference.id,
                ]),
            };
        }

        return source;
    }

    async findAllStatuses(
        expedition: Expedition,
    ): Promise<StatusesGlobalCollection> {
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
}
