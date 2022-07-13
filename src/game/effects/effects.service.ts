import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import {
    AllEnemiesDTO,
    EnemyDTO,
    PlayerDTO,
    RandomEnemyDTO,
    EntityDTO,
    SourceEntityDTO,
    TargetEntityDTO,
} from '../components/expedition/expedition.interface';
import {
    StatusCollection,
    StatusDirection,
    StatusType,
} from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { EFFECT_METADATA } from './effects.decorator';
import {
    EffectDTO,
    IBaseEffect,
    JsonEffect,
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

    async processEffectCollection(
        client: Socket,
        source: SourceEntityDTO,
        availableTargets: {
            player: PlayerDTO;
            randomEnemy?: RandomEnemyDTO;
            selectedEnemy?: EnemyDTO;
            allEnemies?: AllEnemiesDTO;
        },
        collection: JsonEffect[],
        currentRound: number,
    ): Promise<void> {
        for (const effect of collection) {
            const {
                effect: name,
                times = 1,
                args: { value, ...args },
            } = effect;

            const target: EntityDTO = this.defineTarget(
                effect,
                source,
                availableTargets,
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

    public async processEffect(
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
        source: EntityDTO,
        targets: {
            player: PlayerDTO;
            randomEnemy?: RandomEnemyDTO;
            selectedEnemy?: EnemyDTO;
            allEnemies?: AllEnemiesDTO;
        },
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
        dto = await this.statusService.processStatusEffects(
            outgoingStatuses?.[StatusType.Buff],
            name,
            dto,
            currentRound,
        );

        dto = await this.statusService.processStatusEffects(
            outgoingStatuses?.[StatusType.Debuff],
            name,
            dto,
            currentRound,
        );

        // Apply statuses to the incoming effects → 🛡
        dto = await this.statusService.processStatusEffects(
            incomingStatuses?.[StatusType.Buff],
            name,
            dto,
            currentRound,
        );

        dto = await this.statusService.processStatusEffects(
            incomingStatuses?.[StatusType.Debuff],
            name,
            dto,
            currentRound,
        );

        return dto;
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
