import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Socket } from 'socket.io';
import {
    StatusCollection,
    StatusDirection,
    StatusType,
} from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { EFFECT_METADATA } from './effects.decorator';
import {
    Effect,
    EffectDTO,
    Entity,
    IBaseEffect,
    JsonEffect,
} from './effects.interface';

@Injectable()
export class EffectService {
    private cache: Map<string, IBaseEffect>;

    constructor(
        private readonly modulesContainer: ModulesContainer,
        private readonly statusService: StatusService,
    ) {}

    private findEffectByName(name: string): IBaseEffect {
        const effect = this.getAllEffectProviders().get(name);

        if (effect === undefined) throw new Error(`Effect ${name} not found`);

        return effect;
    }

    async process(
        client: Socket,
        source: Entity,
        target: Entity,
        effects: JsonEffect[],
        currentRound: number,
    ): Promise<void> {
        for (const effect of effects) {
            const {
                effect: name,
                times = 1,
                args: { value, ...args },
            } = effect;
            const effectHandler = this.findEffectByName(name);

            let dto: EffectDTO = {
                client,
                source,
                target,
                args: {
                    initialValue: value,
                    currentValue: value,
                    ...args,
                },
            };

            let outgoingStatuses: StatusCollection;
            let incomingStatuses: StatusCollection;

            // Get statuses of the source and target to modify the effects
            if (effectHandler.isPlayer(source))
                outgoingStatuses = source.value.combatState.statuses;
            else if (effectHandler.isEnemy(source))
                outgoingStatuses = source.value.statuses;

            if (effectHandler.isPlayer(target))
                incomingStatuses = target.value.combatState.statuses;
            else if (effectHandler.isEnemy(target))
                incomingStatuses = target.value.statuses;

            outgoingStatuses =
                this.statusService.filterStatusCollectionByDirection(
                    outgoingStatuses,
                    StatusDirection.Outgoing,
                );

            incomingStatuses =
                this.statusService.filterStatusCollectionByDirection(
                    incomingStatuses,
                    StatusDirection.Incoming,
                );

            // Apply statuses to the outgoing effects 🔫  →
            dto = await this.statusService.process(
                outgoingStatuses?.[StatusType.Buff],
                name,
                dto,
                currentRound,
            );

            dto = await this.statusService.process(
                outgoingStatuses?.[StatusType.Debuff],
                name,
                dto,
                currentRound,
            );

            // Apply statuses to the incoming effects → 🛡
            dto = await this.statusService.process(
                incomingStatuses?.[StatusType.Buff],
                name,
                dto,
                currentRound,
            );

            dto = await this.statusService.process(
                incomingStatuses?.[StatusType.Debuff],
                name,
                dto,
                currentRound,
            );

            for (let i = 0; i < times; i++) {
                await this.findEffectByName(name).handle(dto);
            }
        }
    }

    private getAllEffectProviders(): Map<string, IBaseEffect> {
        if (this.cache != undefined) return this.cache;

        const effects: Map<string, IBaseEffect> = new Map();

        for (const module of this.modulesContainer.values()) {
            module.providers.forEach((provider) => {
                if (this.isEffectProvider(provider)) {
                    const effect = this.getEffectMetadata(provider.metatype);

                    if (effects.has(effect.name))
                        throw new Error(`Effect ${effect} already exists`);

                    effects.set(effect.name, provider.instance as IBaseEffect);
                }
            });
        }

        return effects;
    }

    private isEffectProvider(provider: InstanceWrapper<any>) {
        return (
            provider.instance &&
            typeof provider.instance?.handle == 'function' &&
            this.getEffectMetadata(provider.metatype)
        );
    }

    private getEffectMetadata(object: any): Effect | undefined {
        return Reflect.getMetadata(EFFECT_METADATA, object);
    }
}
