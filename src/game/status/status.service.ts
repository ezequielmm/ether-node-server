import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { clone, find, some } from 'lodash';
import { CardTargetedEnum } from '../components/card/card.enum';
import { Effect, EffectDTO } from '../effects/effects.interface';
import { STATUS_METADATA } from './contants';
import {
    StatusEffectHandler,
    StatusMetadata,
    JsonStatus,
    AttachStatusToPlayerDTO,
    AttachStatusToEnemyDTO,
    AttachedStatus,
    StatusCollection,
    StatusDirection,
    StatusStartsAt,
    Status,
    StatusEffect,
    StatusTrigger,
    StatusEvent,
    StatusEventType,
    StatusHandler,
    StatusEventHandler,
    MutateEffectArgsDTO,
} from './interfaces';
import { Model } from 'mongoose';
import {
    Expedition,
    ExpeditionDocument,
} from '../components/expedition/expedition.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { getEnemyIdField } from '../components/enemy/enemy.type';
import { TargetId } from '../effects/effects.types';
import { Socket } from 'socket.io';
import {
    EnemyDTO,
    EnemyReferenceDTO,
    PlayerReferenceDTO,
    SourceEntityDTO,
    SourceEntityReferenceDTO,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { EffectService } from '../effects/effects.service';

type StatusProvider = {
    metadata: StatusMetadata;
    instance: StatusHandler;
};
type StatusProviderDictionary = StatusProvider[];

@Injectable()
export class StatusService {
    private cache: StatusProviderDictionary;

    constructor(
        private readonly modulesContainer: ModulesContainer,
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
        private readonly expeditionService: ExpeditionService,
    ) {}

    public async attachStatusToEnemy(
        dto: AttachStatusToEnemyDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, enemyId, status, currentRound } = dto;

        const { attachedStatus, provider } = this.convertStatusToAttached(
            status,
            currentRound,
            dto.sourceReference,
        );

        const enemyField =
            typeof enemyId === 'string'
                ? 'currentNode.data.enemies.id'
                : 'currentNode.data.enemies.enemyId';

        const clientField =
            typeof clientId === 'string' ? 'clientId' : 'playerId';

        return await this.expedition
            .findOneAndUpdate(
                {
                    [clientField]: clientId,
                    status: ExpeditionStatusEnum.InProgress,
                    [enemyField]: enemyId,
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

        const { attachedStatus, provider } = this.convertStatusToAttached(
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

    public async mutateEffects(dto: MutateEffectArgsDTO): Promise<EffectDTO> {
        const { expedition, collectionOwner, collection, effect, effectDTO } =
            dto;
        let mutatedDTO = clone(effectDTO);
        const {
            currentNode: {
                data: { round },
            },
        } = expedition;
        // Clone the dto to avoid mutating the original
        let collectionModified = false;

        for (const type in collection) {
            const statuses = collection[type];
            for (const status of statuses) {
                const provider = this.findProviderByName(status.name);

                if (provider) {
                    const metadata = provider.metadata;
                    const instance = provider.instance as StatusEffectHandler;

                    if (this.isStatusEffect(metadata.status)) {
                        const isActive = this.isActive(
                            metadata.status.startsAt,
                            status.addedInRound,
                            round,
                        );
                        const compatibleEffect = some(metadata.status.effects, [
                            'name',
                            effect,
                        ]);

                        if (!(isActive && compatibleEffect)) continue;

                        mutatedDTO = await instance.handle({
                            effectDTO: mutatedDTO,
                            args: status.args,
                            update(args) {
                                const index = statuses.indexOf(status);
                                statuses[index].args = args;
                                collectionModified = true;
                            },
                            remove() {
                                const index = statuses.indexOf(status);
                                statuses.splice(index, 1);
                                collectionModified = true;
                            },
                        });
                    }
                }
            }
        }

        if (collectionModified) {
            if (EffectService.isPlayer(collectionOwner)) {
                await this.updatePlayerStatuses(expedition, collection);
            } else if (EffectService.isEnemy(collectionOwner)) {
                await this.updateEnemyStatuses(
                    expedition,
                    collectionOwner,
                    collection,
                );
            }
        }

        return mutatedDTO;
    }

    private async updateEnemyStatuses(
        expedition: Expedition,
        collectionOwner: EnemyDTO,
        collection: StatusCollection,
    ): Promise<void> {
        this.expedition.findOneAndUpdate(
            {
                clientId: expedition.clientId,
                status: ExpeditionStatusEnum.InProgress,
                [`currentNode.data.enemies.${getEnemyIdField(
                    collectionOwner.value.id,
                )}`]: collectionOwner.value.id,
            },
            {
                'currentNode.data.enemies.$.statuses': collection,
            },
        );
    }

    private async updatePlayerStatuses(
        expedition: Expedition,
        collection: StatusCollection,
    ): Promise<void> {
        await this.expedition.findOneAndUpdate(
            {
                clientId: expedition.clientId,
                status: ExpeditionStatusEnum.InProgress,
            },
            {
                'currentNode.data.player.statuses': collection,
            },
        );
    }

    public async triggerEvent(
        client: Socket,
        event: StatusEventType,
    ): Promise<void> {
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });
        const currentNode = expedition.currentNode;

        const statuses = await this.expeditionService.findAllStatuses(
            expedition,
        );

        for (const attachedStatus of statuses) {
            for (const status of attachedStatus.statuses) {
                const provider = this.findProviderByName(status.name);

                if (provider) {
                    const metadata = provider.metadata;
                    const instance = provider.instance as StatusEventHandler;

                    if (this.isStatusEvent(metadata.status)) {
                        const isActive = this.isActive(
                            metadata.status.startsAt,
                            status.addedInRound,
                            currentNode.data.round,
                        );
                        const compatibleEvent = metadata.status.event === event;

                        if (!(isActive && compatibleEvent)) continue;

                        await instance.handle({
                            client,
                            expedition,
                            source: status.sourceReference,
                            target: attachedStatus.target,
                            currentRound: currentNode.data.round,
                            args: status.args,
                        });
                    }
                }
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
        attachedStatus: AttachedStatus;
        provider: StatusProvider;
    } {
        const provider = this.findProviderByName(jsonStatus.name);

        if (!provider) {
            throw new Error(`Status ${jsonStatus.name} does not exist`);
        }

        const attachedStatus: AttachedStatus = {
            name: jsonStatus.name,
            addedInRound: currentRound,
            sourceReference,
            args: {
                value: jsonStatus.args.value,
            },
        };

        return {
            attachedStatus,
            provider,
        };
    }

    public filterCollectionByDirection(
        statuses: StatusCollection,
        statusDirection: StatusDirection,
    ): StatusCollection {
        statuses = clone(statuses);

        const filter = (status) => {
            const provider = this.findProviderByName(status.name);

            return (
                this.isStatusEffect(provider.metadata.status) &&
                provider.metadata.status.direction === statusDirection
            );
        };

        statuses.buff = statuses.buff.filter(filter);
        statuses.debuff = statuses.debuff.filter(filter);

        return statuses;
    }

    private findProviderByName(
        name: string,
        dictionary: StatusProviderDictionary = this.getStatusProviders(),
    ): StatusProvider | undefined {
        return dictionary.find(
            (provider) => provider.metadata.status.name == name,
        );
    }

    private getStatusMetadata(object: any): StatusMetadata {
        return Reflect.getMetadata(STATUS_METADATA, object);
    }

    private getStatusProviders(): StatusProviderDictionary {
        if (this.cache != undefined) {
            return this.cache;
        }

        const dictionary: StatusProviderDictionary = [];

        for (const module of this.modulesContainer.values()) {
            for (const provider of module.providers.values()) {
                if (this.isStatusProvider(provider)) {
                    const metadata = this.getStatusMetadata(provider.metatype);
                    const instance = provider.instance as StatusEffectHandler;

                    const oldProvider = this.findProviderByName(
                        metadata.status.name,
                        dictionary,
                    );

                    if (oldProvider) {
                        throw new Error(
                            `Status ${metadata.status.name} already exists`,
                        );
                    }

                    dictionary.push({
                        metadata,
                        instance,
                    });
                }
            }
        }

        return dictionary;
    }

    private isStatusProvider(provider: InstanceWrapper<any>) {
        if (!provider || !provider.instance || !provider.metatype) {
            return false;
        }

        const statusMetadata = this.getStatusMetadata(provider.metatype);
        const statusInstance = provider.instance as StatusEffectHandler;

        return typeof statusInstance?.handle == 'function' && statusMetadata;
    }

    private isStatusEffect(status: Status): status is StatusEffect {
        return status.trigger == StatusTrigger.Effect;
    }

    private isStatusEvent(status: Status): status is StatusEvent {
        return status.trigger == StatusTrigger.Event;
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

    public async getSourceFromReference(
        client: Socket,
        reference: SourceEntityReferenceDTO,
    ): Promise<SourceEntityDTO> {
        let source: SourceEntityDTO;
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

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
}
