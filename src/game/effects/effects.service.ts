import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import {
    EntityStatuses,
    StatusDirection,
    StatusType,
} from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { EFFECT_METADATA } from './effects.decorator';
import { EffectOwner } from './effects.enum';
import { BaseEffectDTO, IBaseEffect, JsonEffect } from './effects.interface';
import { TargetId } from './effects.types';

@Injectable()
export class EffectService {
    private effectsCached: Map<string, IBaseEffect>;

    constructor(
        private readonly modulesContainer: ModulesContainer,
        private readonly statusService: StatusService,
    ) {}

    private getEffectByName(name: string): IBaseEffect {
        const effect = this.getAllEffectProviders().get(name);

        if (effect === undefined) throw new Error(`Effect ${name} not found`);

        return effect;
    }

    async process(
        client: Socket,
        effects: JsonEffect[],
        currentRound: number,
        targetId?: TargetId,
        owner: EffectOwner = EffectOwner.Player,
    ): Promise<void> {
        for (const {
            name,
            args: { ...args }, // Here goes a baseValue parameter
        } of effects) {
            // TODO: Validate if target exists
            let dto: BaseEffectDTO = {
                ...args,
                client,
                targetId,
            };

            let outgoingStatuses: EntityStatuses;
            let incomingStatuses: EntityStatuses;

            // Get statuses of the owner target to modify the outgoing effects
            if (owner === EffectOwner.Player) {
                outgoingStatuses = await this.statusService.getStatusesByPlayer(
                    client.id,
                    StatusDirection.Outgoing,
                );
            } else if (owner === EffectOwner.Enemy) {
                // TODO: Get statuses of the enemy that performs the effect
            }

            if (args.targeted == CardTargetedEnum.Player) {
                incomingStatuses = await this.statusService.getStatusesByPlayer(
                    client.id,
                    StatusDirection.Incoming,
                );
            } else if (args.targeted == CardTargetedEnum.Enemy) {
                incomingStatuses = await this.statusService.getStatusesByEnemy(
                    client.id,
                    targetId,
                    StatusDirection.Incoming,
                );
            }

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

            await this.getEffectByName(name).handle(dto);
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
