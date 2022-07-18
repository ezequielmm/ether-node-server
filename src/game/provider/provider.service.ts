import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { ProviderContainer } from './interfaces';

@Injectable()
export class ProviderService {
    constructor(private readonly modulesContainer: ModulesContainer) {}

    public findByMetadataKey<M, T>(key: string): ProviderContainer<M, T>[] {
        const providers: ProviderContainer<M, T>[] = [];
        for (const module of this.modulesContainer.values()) {
            for (const provider of module.providers.values()) {
                const instance = provider.instance;
                const metatype = provider.metatype;
                const metadata = Reflect.getMetadata(key, metatype ?? {});

                if (metadata) {
                    providers.push({
                        metadata: metadata as M,
                        instance: instance as T,
                    });
                }
            }
        }
        return providers;
    }
}
