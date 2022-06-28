import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { EFFECT_METADATA } from './effects.decorator';
import { IBaseEffect, JsonEffect } from './effects.interface';
import { TargetId } from './effects.types';

@Injectable()
export class EffectService {
    private effectsCached: Map<string, IBaseEffect>;

    constructor(private readonly modulesContainer: ModulesContainer) {}

    private getEffectByName(name: string): IBaseEffect {
        const effect = this.getAllEffectProviders().get(name);

        if (effect === undefined) throw new Error(`Effect ${name} not found`);

        return effect;
    }

    async process(
        client_id: string,
        effects: JsonEffect[],
        targetedId?: TargetId,
    ): Promise<void> {
        for (const { name, args } of effects) {
            await this.getEffectByName(name).handle({
                ...args,
                client_id,
                targetedId,
            });
        }
    }

    private getAllEffectProviders(): Map<string, IBaseEffect> {
        if (this.effectsCached != undefined) return this.effectsCached;

        const effects: Map<string, IBaseEffect> = new Map();

        for (const module of this.modulesContainer.values()) {
            module.providers.forEach((provider) => {
                if (this.isEffectProvider(provider)) {
                    const effectName = this.getEffectNameMetadata(
                        provider.metatype,
                    );

                    if (effects.has(effectName))
                        throw new Error(`Effect ${effectName} already exists`);

                    effects.set(effectName, provider.instance as IBaseEffect);
                }
            });
        }

        return effects;
    }

    private isEffectProvider(provider: InstanceWrapper<any>) {
        return (
            provider.instance &&
            typeof provider.instance?.handle == 'function' &&
            this.getEffectNameMetadata(provider.metatype)
        );
    }

    private getEffectNameMetadata(object: any): string {
        return Reflect.getMetadata(EFFECT_METADATA, object);
    }
}
