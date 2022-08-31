import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { isNotUndefined } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { damageEffect } from './constants';

export interface DamageArgs {
    useDefense?: boolean;
    multiplier?: number;
    useEnergyAsValue?: boolean;
    useEnergyAsMultiplier?: boolean;
}

@EffectDecorator({
    effect: damageEffect,
})
@Injectable()
export class DamageEffect implements EffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly eventEmitter: EventEmitter2,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(payload: EffectDTO<DamageArgs>): Promise<void> {
        const {
            ctx,
            source,
            target,
            args: {
                currentValue,
                useDefense,
                multiplier,
                useEnergyAsMultiplier,
                useEnergyAsValue,
            },
        } = payload;

        const {
            value: {
                combatState: { energy, defense },
            },
        } = this.playerService.get(ctx);

        let oldHp = 0;
        let newHp = 0;
        let oldDefense = 0;
        let newDefense = 0;

        // Check targeted type
        if (EnemyService.isEnemy(target)) {
            // First we check if we have to deal a multiplier
            // using the remaining energy of the player
            const damage =
                currentValue *
                (useEnergyAsMultiplier ? energy : 1) *
                (useDefense ? multiplier * defense : 1);

            oldHp = target.value.hpCurrent;
            oldDefense = target.value.defense;

            await this.enemyService.damage(ctx, target.value.id, damage);

            newHp = target.value.hpCurrent;
            newDefense = target.value.defense;
        }

        if (PlayerService.isPlayer(target)) {
            // Here we check if we have to use the enemy available
            // as currentValue, here we just need to add it, the value
            // on the effect is 0
            const damage = isNotUndefined(useEnergyAsValue)
                ? energy
                : currentValue;

            oldHp = target.value.combatState.hpCurrent;
            oldDefense = target.value.combatState.defense;

            await this.playerService.damage(ctx, damage);

            newHp = target.value.combatState.hpCurrent;
            newDefense = target.value.combatState.defense;
        }

        // Add the damage to the combat queue
        await this.combatQueueService.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Damage,
                healthDelta: newHp - oldHp,
                defenseDelta: newDefense - oldDefense,
                finalHealth: newHp,
                finalDefense: newDefense,
                statuses: [],
            },
        });
    }
}
