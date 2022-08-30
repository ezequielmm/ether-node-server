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
            args: { currentValue: hpToAdd },
        } = payload;

        if (PlayerService.isPlayer(target)) {
            const {
                value: {
                    combatState: { hpCurrent, hpMax },
                },
            } = target;

            const newHp = Math.min(hpMax, hpCurrent + hpToAdd);

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

        if (EnemyService.isEnemy(target)) {
            const {
                value: { hpCurrent, hpMax },
            } = target;

            const newHp = Math.min(hpMax, hpCurrent + hpToAdd);

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
}
