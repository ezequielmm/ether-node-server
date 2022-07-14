import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { clone } from 'lodash';
import { CardTargetedEnum } from '../components/card/card.enum';
import { Effect, EffectDTO } from '../effects/effects.interface';
import { STATUS_METADATA } from './contants';
import {
    IBaseStatus,
    StatusMetadata,
    CardStatus,
    AttachStatusToPlayerDTO,
    AttachStatusToEnemyDTO,
    AttachedStatus,
    StatusCollection,
    StatusDirection,
    StatusStartsAt,
} from './interfaces';
import { Model } from 'mongoose';
import {
    Expedition,
    ExpeditionDocument,
} from '../components/expedition/expedition.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { ClientId } from '../components/expedition/expedition.type';
import { TargetId } from '../effects/effects.types';

type StatusProvider = { metadata: StatusMetadata; instance: IBaseStatus };
type StatusProviderDictionary = StatusProvider[];

@Injectable()
export class StatusService {
    private cache: StatusProviderDictionary;

    constructor(
        private readonly modulesContainer: ModulesContainer,
        @InjectModel(Expedition.name)
        private readonly expedition: Model<ExpeditionDocument>,
    ) {}

    public async attachStatusToEnemy(
        dto: AttachStatusToEnemyDTO,
    ): Promise<ExpeditionDocument> {
        const { clientId, enemyId, status, currentRound } = dto;

        const { attachedStatus, provider } =
            this.convertCardStatusToAttachedStatus(status, currentRound);

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

        const { attachedStatus, provider } =
            this.convertCardStatusToAttachedStatus(status, currentRound);

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
        statuses: CardStatus[],
        currentRound: number,
        targetId?: TargetId,
    ): Promise<void> {
        for (const status of statuses) {
            switch (status.args.attachTo) {
                case CardTargetedEnum.Player:
                    await this.attachStatusToPlayer({
                        clientId,
                        status,
                        currentRound,
                    });
                    break;
                case CardTargetedEnum.Enemy:
                    await this.attachStatusToEnemy({
                        clientId,
                        status,
                        enemyId: targetId,
                        currentRound,
                    });
                    break;
            }
        }
    }

    public async getStatusesByEnemy(
        clientId: ClientId,
        enemyId: EnemyId,
        statusDirection: StatusDirection = StatusDirection.Incoming,
    ): Promise<StatusCollection> {
        const clientField =
            typeof clientId === 'string' ? 'clientId' : 'playerId';

        const enemyField = typeof enemyId === 'string' ? 'id' : 'enemyId';

        const {
            currentNode: {
                data: { enemies },
            },
        } = await this.expedition
            .findOne({
                [clientField]: clientId,
                status: ExpeditionStatusEnum.InProgress,
            })
            .select('currentNode.data.enemies')
            .lean();
        const enemy = enemies.find((enemy) => enemy[enemyField] == enemyId);

        if (!enemy) throw new Error(`Enemy ${enemyId} not found`);

        if (!enemy.statuses) return null;

        this.filterStatusCollectionByDirection(enemy.statuses, statusDirection);

        return enemy?.statuses;
    }

    public async getStatusesByPlayer(
        clientId: string,
        statusDirection: StatusDirection = StatusDirection.Incoming,
    ): Promise<StatusCollection | undefined> {
        const clientField =
            typeof clientId === 'string' ? 'clientId' : 'playerId';

        const {
            currentNode: {
                data: {
                    player: { statuses },
                },
            },
        } = await this.expedition
            .findOne({
                [clientField]: clientId,
                status: ExpeditionStatusEnum.InProgress,
            })
            .select('currentNode.data.player.statuses')
            .lean();

        this.filterStatusCollectionByDirection(statuses, statusDirection);

        return statuses;
    }

    public async process(
        statuses: AttachedStatus[],
        effect: Effect['name'],
        dto: EffectDTO,
        currentRound: number,
    ): Promise<EffectDTO> {
        if (!statuses?.length) {
            return dto;
        }

        // Clone the dto to avoid mutating the original
        dto = clone(dto);

        for (const status of statuses) {
            const provider = this.findStatusProviderByName(status.name);

            if (provider) {
                const providerMetadata = provider.metadata;
                const providerInstance = provider.instance;

                // Validate if the status can starts in this round
                if (
                    !this.canApplyStatusInThisRound(
                        providerMetadata.status.startsAt,
                        status.args.addedInRound,
                        currentRound,
                    )
                )
                    continue;

                // Validate if the status is valid for the effect
                if (
                    !providerMetadata.effects.some(
                        (effectName) => effectName.name == effect,
                    )
                ) {
                    continue;
                }

                dto = await providerInstance.handle({
                    effectDTO: dto,
                    args: status.args,
                });
            }
        }

        return dto;
    }

    private canApplyStatusInThisRound(
        startsAt: StatusStartsAt,
        addedInRound: number,
        currentRound: number,
    ): boolean {
        return !(
            startsAt == StatusStartsAt.NextTurn && addedInRound == currentRound
        );
    }

    private convertCardStatusToAttachedStatus(
        jsonStatus: CardStatus,
        currentRound: number,
    ): {
        attachedStatus: AttachedStatus;
        provider: StatusProvider;
    } {
        const provider = this.findStatusProviderByName(jsonStatus.name);

        if (!provider) {
            throw new Error(`Status ${jsonStatus.name} does not exist`);
        }

        const attachedStatus: AttachedStatus = {
            name: jsonStatus.name,
            args: {
                value: jsonStatus.args.value,
                addedInRound: currentRound,
            },
        };

        return {
            attachedStatus,
            provider,
        };
    }

    public filterStatusCollectionByDirection(
        statuses: StatusCollection,
        statusDirection: StatusDirection,
    ): StatusCollection {
        statuses = clone(statuses);

        const filter = (status) =>
            this.findStatusProviderByName(status.name).metadata.status
                .direction === statusDirection;

        statuses.buff = statuses.buff.filter(filter);
        statuses.debuff = statuses.debuff.filter(filter);

        return statuses;
    }

    private findStatusProviderByName(
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
                    const instance = provider.instance as IBaseStatus;

                    const oldStatusProvider = this.findStatusProviderByName(
                        metadata.status.name,
                        dictionary,
                    );

                    if (oldStatusProvider) {
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
        const statusInstance = provider.instance as IBaseStatus;

        return typeof statusInstance?.handle == 'function' && statusMetadata;
    }
}
