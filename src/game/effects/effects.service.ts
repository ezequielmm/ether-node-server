import { Injectable } from '@nestjs/common';
import { find, sample } from 'lodash';
import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId, getEnemyIdField } from '../components/enemy/enemy.type';
import { Expedition } from '../components/expedition/expedition.schema';
import { ProviderContainer } from '../provider/interfaces';
import { ProviderService } from '../provider/provider.service';
import { StatusDirection } from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { EFFECT_METADATA_KEY } from './effects.decorator';
import {
    EffectDTO,
    EffectHandler,
    EffectMetadata,
    ApplyAllDTO,
    ApplyDTO,
    SourceEntityDTO,
    TargetEntityDTO,
    PlayerDTO,
    EnemyDTO,
    RandomEnemyDTO,
    AllEnemiesDTO,
    MutateDTO,
    FindTargetsDTO,
} from './effects.interface';

@Injectable()
export class EffectService {
    private handlers: ProviderContainer<EffectMetadata, EffectHandler>[];

    constructor(
        private readonly providerService: ProviderService,
        private readonly statusService: StatusService,
    ) {}

    async applyAll(dto: ApplyAllDTO): Promise<void> {
        const { client, expedition, source, effects, selectedEnemy } = dto;

        for (const effect of effects) {
            const targets = this.findAffectedTargets({
                expedition,
                effect,
                source,
                selectedEnemy,
            });

            for (const target of targets) {
                await this.apply({
                    client,
                    expedition,
                    source,
                    target,
                    effect,
                });
            }
        }
    }

    public async apply(dto: ApplyDTO) {
        const { client, expedition, source, target, effect } = dto;
        const {
            effect: name,
            times = 1,
            args: { value, ...args },
        } = effect;

        let effectDTO: EffectDTO = {
            client,
            expedition,
            source,
            target,
            args: {
                initialValue: value,
                currentValue: value,
                ...args,
            },
        };

        effectDTO = await this.mutate({
            client,
            expedition,
            dto: effectDTO,
            effect: name,
        });

        for (let i = 0; i < times; i++) {
            const handler = this.findHandlerByName(name);
            await handler.handle(effectDTO);
        }
    }

    private findAffectedTargets(dto: FindTargetsDTO): TargetEntityDTO[] {
        const { effect, source, expedition, selectedEnemy } = dto;
        const targets: TargetEntityDTO[] = [];

        switch (effect.target) {
            case CardTargetedEnum.Player:
                targets.push(EffectService.extractPlayerDTO(expedition));
                break;
            case CardTargetedEnum.Self:
                targets.push(source);
                break;
            case CardTargetedEnum.AllEnemies:
                EffectService.extractAllEnemiesDTO(expedition).value.forEach(
                    (enemy) =>
                        targets.push({
                            type: CardTargetedEnum.Enemy,
                            value: enemy,
                        }),
                );
                break;
            case CardTargetedEnum.RandomEnemy:
                targets.push({
                    type: CardTargetedEnum.Enemy,
                    value: EffectService.extractRandomEnemyDTO(expedition)
                        .value,
                });
                break;
            case CardTargetedEnum.Enemy:
                targets.push(
                    EffectService.extractEnemyDTO(expedition, selectedEnemy),
                );
                break;
        }

        if (targets === undefined)
            throw new Error(`Target not found for effect ${effect.effect}`);

        return targets;
    }

    public static extractPlayerDTO(expedition: Expedition): PlayerDTO {
        const {
            playerState: globalState,
            currentNode: {
                data: { player: combatState },
            },
        } = expedition;

        return {
            type: CardTargetedEnum.Player,
            value: {
                globalState,
                combatState,
            },
        };
    }

    public static extractEnemyDTO(
        expedition: Expedition,
        enemy: EnemyId,
    ): EnemyDTO {
        const {
            currentNode: {
                data: { enemies },
            },
        } = expedition;

        return {
            type: CardTargetedEnum.Enemy,
            value: find(enemies, [getEnemyIdField(enemy), enemy]),
        };
    }

    public static extractRandomEnemyDTO(
        expedition: Expedition,
    ): RandomEnemyDTO {
        const {
            currentNode: {
                data: { enemies },
            },
        } = expedition;

        return {
            type: CardTargetedEnum.RandomEnemy,
            value: sample(enemies),
        };
    }

    public static extractAllEnemiesDTO(expedition: Expedition): AllEnemiesDTO {
        const {
            currentNode: {
                data: { enemies },
            },
        } = expedition;

        return {
            type: CardTargetedEnum.AllEnemies,
            value: enemies,
        };
    }

    private async mutate(dto: MutateDTO): Promise<EffectDTO> {
        const {
            client,
            expedition,
            effect,
            dto: { source, target },
        } = dto;
        let { dto: effectDTO } = dto;

        const outgoingStatuses = this.statusService.findEffectStatuses(
            source,
            StatusDirection.Outgoing,
        );
        const incomingStatuses = this.statusService.findEffectStatuses(
            target,
            StatusDirection.Incoming,
        );

        // Apply statuses to the outgoing effects 🔫  →
        effectDTO = await this.statusService.mutate({
            client,
            expedition,
            collection: outgoingStatuses,
            collectionOwner: source,
            effectDTO: effectDTO,
            effect,
            preview: false,
        });

        // Apply statuses to the incoming effects → 🛡
        effectDTO = await this.statusService.mutate({
            client,
            expedition,
            collection: incomingStatuses,
            collectionOwner: target,
            effectDTO: effectDTO,
            effect,
            preview: false,
        });

        return effectDTO;
    }

    public async preview(dto: MutateDTO): Promise<EffectDTO> {
        const {
            client,
            expedition,
            effect,
            dto: { source },
        } = dto;
        let { dto: effectDTO } = dto;

        const outgoingStatuses = this.statusService.findEffectStatuses(
            source,
            StatusDirection.Outgoing,
        );

        // Apply statuses to the outgoing effects 🔫  →
        effectDTO = await this.statusService.mutate({
            client,
            expedition,
            collection: outgoingStatuses,
            collectionOwner: source,
            effectDTO: effectDTO,
            effect,
            preview: true,
        });

        return effectDTO;
    }

    private findHandlerByName(name: string): EffectHandler {
        this.handlers =
            this.handlers ||
            this.providerService.findByMetadataKey(EFFECT_METADATA_KEY);

        const container = find(this.handlers, ['metadata.effect.name', name]);

        if (container === undefined)
            throw new Error(`Effect handler ${name} not found`);

        return container.instance;
    }

    public static isPlayer(
        entity: SourceEntityDTO | TargetEntityDTO,
    ): entity is PlayerDTO {
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
