import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import {
    StatusCollection,
    StatusDirection,
    StatusType,
} from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { EFFECT_METADATA } from './effects.decorator';
import {
    EffectDTO,
    EffectDTOEnemy,
    EffectDTOPlayer,
    EffectDTOAllEnemies,
    Entity,
    IBaseEffect,
    JsonEffect,
    EffectDTORandomEnemy,
    EffectMetadata,
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
        availableTargets: {
            player: EffectDTOPlayer;
            randomEnemy: EffectDTORandomEnemy;
            selectedEnemy?: EffectDTOEnemy;
            allEnemies: EffectDTOAllEnemies;
        },
        effects: JsonEffect[],
        currentRound: number,
    ): Promise<void> {
        for (const effect of effects) {
            const {
                effect: name,
                times = 1,
                args: { value, ...args },
            } = effect;

            // Validate target
            let target: Entity;

            if (effect.target == CardTargetedEnum.Player) {
                target = availableTargets.player;
            } else if (effect.target == CardTargetedEnum.Self) {
                target = source;
            } else if (effect.target == CardTargetedEnum.AllEnemies) {
                target = availableTargets.allEnemies;
            } else if (effect.target == CardTargetedEnum.RandomEnemy) {
                target = availableTargets.randomEnemy;
            } else if (effect.target == CardTargetedEnum.Enemy) {
                if (!availableTargets.selectedEnemy) {
                    throw new Error(
                        `Effect ${name} requires a selected enemy, but none was provided`,
                    );
                }
                target = availableTargets.selectedEnemy;
            }

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
            if (EffectService.isPlayer(source))
                outgoingStatuses = source.value.combatState.statuses;
            else if (EffectService.isEnemy(source))
                outgoingStatuses = source.value.statuses;

            if (EffectService.isPlayer(target))
                incomingStatuses = target.value.combatState.statuses;
            else if (EffectService.isEnemy(target))
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
                    const metadata = this.getEffectMetadata(provider.metatype);

                    if (effects.has(metadata.effect.name))
                        throw new Error(`Effect ${metadata} already exists`);

                    effects.set(
                        metadata.effect.name,
                        provider.instance as IBaseEffect,
                    );
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

    private getEffectMetadata(object: any): EffectMetadata | undefined {
        return Reflect.getMetadata(EFFECT_METADATA, object);
    }

    public static isPlayer(entity: Entity): entity is EffectDTOPlayer {
        return entity.type === CardTargetedEnum.Player;
    }

    public static isEnemy(entity): entity is EffectDTOEnemy {
        return entity.type === CardTargetedEnum.Enemy;
    }

    public static isAllEnemies(entity): entity is EffectDTOAllEnemies {
        return entity.type === CardTargetedEnum.AllEnemies;
    }
}
