import { Injectable } from '@nestjs/common';
import { healEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
export interface HealArgs {
    value: number;
    percentage: number;
}
@EffectDecorator({
    effect: healEffect,
})
@Injectable()
export class HealEffect implements EffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(payload: EffectDTO<HealArgs>): Promise<void> {
        const {
            ctx,
            source,
            target,
            args: { currentValue: hpToAdd, percentage },
        } = payload;

        // hpToAdd is the amount of hp to add to the hpCurrent value

        // Here we check is the target to heal is the player
        if (PlayerService.isPlayer(target)) {
            const {
                value: {
                    combatState: { hpCurrent, hpMax },
                },
            } = target;

            const newHp = this.calculateHp(
                hpMax,
                hpCurrent,
                hpToAdd,
                percentage,
            );

            await this.playerService.setHp(ctx, newHp);

            await this.combatQueueService.push({
                ctx,
                source,
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Heal,
                    defenseDelta: 0,
                    finalDefense: 0,
                    healthDelta: hpToAdd,
                    finalHealth: newHp,
                    statuses: [],
                },
            });
        }

        // And here we check is the target to heal is the enemy
        if (EnemyService.isEnemy(target)) {
            const {
                value: { hpCurrent, hpMax },
            } = target;

            const newHp = this.calculateHp(
                hpMax,
                hpCurrent,
                hpToAdd,
                percentage,
            );

            await this.enemyService.setHp(ctx, target.value.id, newHp);

            await this.combatQueueService.push({
                ctx,
                source,
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Heal,
                    defenseDelta: 0,
                    finalDefense: 0,
                    healthDelta: hpToAdd,
                    finalHealth: newHp,
                    statuses: [],
                },
            });
        }
    }

    private calculateHp(
        hpMax: number,
        hpCurrent: number,
        hpToAdd: number,
        percentage: number,
    ): number {
        let newHealth = hpCurrent + hpToAdd;

        /// Here we check if we have a percentega to check
        if (percentage > 0) {
            // if we have a percentage we recover the percentege of max hp
            newHealth = hpCurrent + hpCurrent * percentage;
        }

        return Math.floor(Math.min(hpMax, newHealth));
    }
}
