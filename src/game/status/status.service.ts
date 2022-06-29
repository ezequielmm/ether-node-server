import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { clone } from 'lodash';
import { EffectName } from '../effects/effects.enum';
import { BaseEffectDTO } from '../effects/effects.interface';
import { STATUS_METADATA } from './contants';
import {
    IBaseStatus,
    StatusMetadata,
    StatusJson,
    StatusType,
    StatusName,
} from './interfaces';

type StatusesItem = {
    [key in StatusType]: { name: StatusName; instance: IBaseStatus }[];
};

type StatusDictionary = Map<EffectName, StatusesItem>;

@Injectable()
export class StatusService {
    private cache: StatusDictionary;

    constructor(private readonly modulesContainer: ModulesContainer) {}

    async process(
        statuses: StatusJson[],
        effect: EffectName,
        dto: BaseEffectDTO,
    ): Promise<BaseEffectDTO> {
        const statusesByEffect = this.getStatusesByEffect(effect);
        let result = dto;

        for (const status of [
            // Start with buff statuses
            ...statusesByEffect.buff,
            // Then apply debuff statuses
            ...statusesByEffect.debuff,
        ]) {
            // Check if status is in the list of statuses
            const json = statuses.find(
                (statusJson) => statusJson.name == status.name,
            );
            if (json) {
                result = await status.instance.handle(clone(result), json.args);
            }
        }

        return result;
    }

    private getStatusesByEffect(name: EffectName): StatusesItem {
        const status = this.getStatusProviders().get(name);

        if (status === undefined) {
            throw new Error(`Status ${name} not found`);
        }

        return status;
    }

    private getStatusProviders(): StatusDictionary {
        if (this.cache != undefined) {
            return this.cache;
        }

        const dictonary: StatusDictionary = new Map();

        for (const module of this.modulesContainer.values()) {
            module.providers.forEach((provider) => {
                if (this.isStatusProvider(provider)) {
                    const metadata = this.getStatusMetadata(provider.metatype);

                    for (const effect of metadata.effects) {
                        const status = provider.instance as IBaseStatus;
                        const type = metadata.type;

                        if (!dictonary.has(effect)) {
                            dictonary.set(effect, {
                                [StatusType.Buff]: [],
                                [StatusType.Debuff]: [],
                            });
                        }

                        dictonary.get(effect)[type].push({
                            name: metadata.name,
                            instance: status,
                        });
                    }
                }
            });
        }

        return dictonary;
    }

    private isStatusProvider(provider: InstanceWrapper<any>) {
        if (!provider || !provider.instance || !provider.metatype) {
            return false;
        }

        const statusMetadata = this.getStatusMetadata(provider.metatype);
        const statusInstance = provider.instance as IBaseStatus;

        return typeof statusInstance?.handle == 'function' && statusMetadata;
    }

    private getStatusMetadata(object: any): StatusMetadata {
        return Reflect.getMetadata(STATUS_METADATA, object);
    }
}
