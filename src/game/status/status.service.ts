import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { STATUS_METADATA } from './contants';
import { IBaseStatus, StatusJson } from './interfaces';

@Injectable()
export class StatusService {
    private cache: Map<string, IBaseStatus>;

    constructor(private readonly modulesContainer: ModulesContainer) {}

    async process(client_id: string, statuses: StatusJson[]): Promise<void> {
        for (const { name, args } of statuses) {
            await this.getStatusByName(name).handle({ ...args, client_id });
        }
    }

    private getStatusByName(name: string): IBaseStatus {
        const status = this.getAllStatusProivders().get(name);

        if (status === undefined) {
            throw new Error(`Status ${name} not found`);
        }

        return status;
    }

    private getAllStatusProivders(): Map<string, IBaseStatus> {
        if (this.cache != undefined) {
            return this.cache;
        }

        const statuses: Map<string, IBaseStatus> = new Map();
        for (const module of this.modulesContainer.values()) {
            module.providers.forEach((provider) => {
                if (this.isStatusProvider(provider)) {
                    const name = this.getStatusNameMetadata(provider.metatype);

                    if (statuses.has(name)) {
                        throw new Error(`Effect ${name} already exists`);
                    }

                    statuses.set(name, provider.instance as IBaseStatus);
                }
            });
        }

        return statuses;
    }

    private isStatusProvider(provider: InstanceWrapper<any>) {
        return (
            provider.instance &&
            typeof provider.instance?.handle == 'function' &&
            this.getStatusNameMetadata(provider.metatype)
        );
    }

    private getStatusNameMetadata(object: any): string {
        return Reflect.getMetadata(STATUS_METADATA, object);
    }
}
