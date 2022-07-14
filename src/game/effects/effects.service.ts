import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import {
    AllEnemiesDTO,
    EnemyDTO,
    PlayerDTO,
    RandomEnemyDTO,
    EntityDTO,
    SourceEntityDTO,
    TargetEntityDTO,
} from '../components/expedition/expedition.interface';
import { Expedition } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StatusCollection,
    StatusDirection,
    StatusType,
} from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { EFFECT_METADATA } from './effects.decorator';
import {
    EffectDTO,
    EffectHandler,
    JsonEffect,
    EffectMetadata,
    ExpeditionTargets,
} from './effects.interface';

@Injectable()
export class EffectService {
    private cache: Map<string, EffectHandler>;

    constructor(
        private readonly modulesContainer: ModulesContainer,
        private readonly statusService: StatusService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    private findEffectByName(name: string): EffectHandler {
        const effect = this.getAllEffectProviders().get(name);

        if (effect === undefined) throw new Error(`Effect ${name} not found`);

        return effect;
    }

    async applyCollection(
        client: Socket,
        expedition: Expedition,
        source: SourceEntityDTO,
        collection: JsonEffect[],
        currentRound: number,
        selectedEnemy?: EnemyId,
    ): Promise<void> {
        const targets = await this.expeditionService.findTargets(
            expedition,
            selectedEnemy,
        );

        for (const effect of collection) {
            const {
                effect: name,
                times = 1,
                args: { value, ...args },
            } = effect;

            const target: EntityDTO = this.defineTarget(
                effect,
                source,
                targets,
            );

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

            dto = await this.mutateDTO(source, target, dto, name, currentRound);

            for (let i = 0; i < times; i++) {
                await this.findEffectByName(name).handle(dto);
            }
        }
    }

    public async apply(
        client: Socket,
        source: SourceEntityDTO,
        target: TargetEntityDTO,
        effect: JsonEffect,
        currentRound: number,
    ) {
        const {
            effect: name,
            times = 1,
            args: { value, ...args },
        } = effect;

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

        dto = await this.mutateDTO(source, target, dto, name, currentRound);

        for (let i = 0; i < times; i++) {
            await this.findEffectByName(name).handle(dto);
        }
    }

    private defineTarget(
        effect: JsonEffect,
        source: SourceEntityDTO,
        targets: ExpeditionTargets,
    ) {
        let target: EntityDTO;
        switch (effect.target) {
            case CardTargetedEnum.Player:
                target = targets.player;
                break;
            case CardTargetedEnum.Self:
                target = source;
                break;
            case CardTargetedEnum.AllEnemies:
                target = targets.allEnemies;
                break;
            case CardTargetedEnum.RandomEnemy:
                target = targets.randomEnemy;
                break;
            case CardTargetedEnum.Enemy:
                target = targets.selectedEnemy;
                break;
        }

        if (target === undefined)
            throw new Error(`Target not found for effect ${effect.effect}`);

        return target;
    }

    private async mutateDTO(
        source: EntityDTO,
        target: EntityDTO,
        dto: EffectDTO<Record<string, any>>,
        name: string,
        currentRound: number,
    ) {
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

        outgoingStatuses = this.statusService.filterCollectionByDirection(
            outgoingStatuses,
            StatusDirection.Outgoing,
        );

        incomingStatuses = this.statusService.filterCollectionByDirection(
            incomingStatuses,
            StatusDirection.Incoming,
        );

        // Apply statuses to the outgoing effects 🔫  →
        dto = await this.statusService.mutateEffects(
            outgoingStatuses?.[StatusType.Buff],
            name,
            dto,
            currentRound,
        );

        dto = await this.statusService.mutateEffects(
            outgoingStatuses?.[StatusType.Debuff],
            name,
            dto,
            currentRound,
        );

        // Apply statuses to the incoming effects → 🛡
        dto = await this.statusService.mutateEffects(
            incomingStatuses?.[StatusType.Buff],
            name,
            dto,
            currentRound,
        );

        dto = await this.statusService.mutateEffects(
            incomingStatuses?.[StatusType.Debuff],
            name,
            dto,
            currentRound,
        );

        return dto;
    }

    private getAllEffectProviders(): Map<string, EffectHandler> {
        if (this.cache != undefined) return this.cache;

        const effects: Map<string, EffectHandler> = new Map();

        for (const module of this.modulesContainer.values()) {
            module.providers.forEach((provider) => {
                if (this.isEffectProvider(provider)) {
                    const metadata = this.getEffectMetadata(provider.metatype);

                    if (effects.has(metadata.effect.name))
                        throw new Error(`Effect ${metadata} already exists`);

                    effects.set(
                        metadata.effect.name,
                        provider.instance as EffectHandler,
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

    public static isPlayer(entity: EntityDTO): entity is PlayerDTO {
        return entity.type === CardTargetedEnum.Player;
    }

    public static isEnemy(entity): entity is EnemyDTO {
        return entity.type === CardTargetedEnum.Enemy;
    }

    public static isAllEnemies(entity): entity is AllEnemiesDTO {
        return entity.type === CardTargetedEnum.AllEnemies;
    }

    public static isRandomEnemy(entity): entity is RandomEnemyDTO {
        return entity.type === CardTargetedEnum.RandomEnemy;
    }
}
