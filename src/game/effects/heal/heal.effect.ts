import { Injectable } from '@nestjs/common';
import { healEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import {
    CombatQueueTargetEffectTypeEnum,
    CombatQueueTargetTypeEnum,
} from 'src/game/components/combatQueue/combatQueue.enum';
import { ICombatQueueTarget } from 'src/game/components/combatQueue/combatQueue.interface';
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
            target,
            args: { currentValue: hpToAdd },
            combatQueueId,
        } = payload;

        if (PlayerService.isPlayer(target)) {
            const {
                value: {
                    globalState: { playerId },
                    combatState: { hpCurrent, hpMax },
                },
            } = target;

            const newHp = Math.min(hpMax, hpCurrent + hpToAdd);

            // Here we create the target for the combat queue
            const combatQueueTarget: ICombatQueueTarget = {
                effectType: CombatQueueTargetEffectTypeEnum.Heal,
                targetType: CombatQueueTargetTypeEnum.Player,
                targetId: playerId,
                defenseDelta: 0,
                finalDefense: 0,
                healthDelta: hpToAdd,
                finalHealth: newHp,
                statuses: [],
            };

            await this.playerService.setHp(ctx, newHp);

            await this.combatQueueService.addTargetsToCombatQueue(
                combatQueueId,
                [combatQueueTarget],
            );
        }

        if (EnemyService.isEnemy(target)) {
            const {
                value: { id, hpCurrent, hpMax },
            } = target;

            const newHp = Math.min(hpMax, hpCurrent + hpToAdd);

            // Here we create the target for the combat queue
            const combatQueueTarget: ICombatQueueTarget = {
                effectType: CombatQueueTargetEffectTypeEnum.Heal,
                targetType: CombatQueueTargetTypeEnum.Enemy,
                targetId: id,
                defenseDelta: 0,
                finalDefense: 0,
                healthDelta: hpToAdd,
                finalHealth: newHp,
                statuses: [],
            };

            await this.enemyService.setHp(ctx, target.value.id, newHp);

            await this.combatQueueService.addTargetsToCombatQueue(
                combatQueueId,
                [combatQueueTarget],
            );
        }
    }
}
