import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { clone } from 'lodash';
import { CardTargetedEnum } from '../components/card/card.enum';
import { EffectName } from '../effects/effects.enum';
import { BaseEffectDTO } from '../effects/effects.interface';
import { Statuses, STATUS_METADATA } from './contants';
import {
    IBaseStatus,
    StatusMetadata,
    JsonStatus,
    AttachStatusToPlayerDTO,
    AttachStatusToEnemyDTO,
    AttachedStatus,
    EntityStatuses,
    StatusDirection,
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
        const { clientId, enemyId, status } = dto;

        const { attachedStatus, provider } =
            this.convertJsonStatusToAttachedStatus(status);

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
        const { clientId, status } = dto;

        const { attachedStatus, provider } =
            this.convertJsonStatusToAttachedStatus(status);

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
        targetId?: string | number,
    ): Promise<void> {
        for (const status of statuses) {
            switch (status.args.attachTo) {
                case CardTargetedEnum.Player:
                    await this.attachStatusToPlayer({
                        clientId,
                        status,
                    });
                    break;
                case CardTargetedEnum.Enemy:
                    await this.attachStatusToEnemy({
                        clientId,
                        status,
                        enemyId: targetId,
                    });
                    break;
            }
        }
    }

    public async getStatusesByEnemy(
        clientId: ClientId,
        enemyId: EnemyId,
        statusDirection: StatusDirection = StatusDirection.Incoming,
    ): Promise<EntityStatuses> {
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

        if (!enemy) {
            throw new Error(`Enemy ${enemyId} not found`);
        }

        if (!enemy.statuses) return null;

        this.filterEntityStatusesByDirection(enemy.statuses, statusDirection);

        return enemy?.statuses;
    }

    public async getStatusesByPlayer(
        clientId: string,
        statusDirection: StatusDirection = StatusDirection.Incoming,
    ): Promise<EntityStatuses | undefined> {
        const {
            currentNode: {
                data: {
                    player: { statuses },
                },
            },
        } = await this.expedition
            .findOne({
                clientId,
                status: ExpeditionStatusEnum.InProgress,
            })
            .select('currentNode.data.player.statuses')
            .lean();

        this.filterEntityStatusesByDirection(statuses, statusDirection);

        return statuses;
    }

    public async process(
        statuses: AttachedStatus[],
        effect: EffectName,
        dto: BaseEffectDTO,
    ): Promise<BaseEffectDTO> {
        if (!statuses?.length) {
            return dto;
        }

        // Clone the dto to avoid mutating the original
        dto = clone(dto);

        for (const status of statuses) {
            const provider = this.findStatusProviderByName(status.name);

            if (provider) {
                // Validate if the status is valid for the effect
                if (
                    !provider.metadata.effects.some(
                        (effectName) => effectName == effect,
                    )
                ) {
                    continue;
                }

                const { instance } = provider;

                dto = await instance.handle({
                    baseEffectDTO: dto,
                    args: status.args,
                });
            }
        }

        return dto;
    }

    private convertJsonStatusToAttachedStatus(jsonStatus: JsonStatus): {
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
            },
        };

        return {
            attachedStatus,
            provider,
        };
    }

    private filterEntityStatusesByDirection(
        statuses: EntityStatuses,
        statusDirection: StatusDirection,
    ): EntityStatuses {
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
