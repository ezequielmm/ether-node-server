import { Injectable } from '@nestjs/common';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { removeDefenseEffect } from './constants';

@EffectDecorator({
    effect: removeDefenseEffect,
})
@Injectable()
export class RemoveDefenseEffect implements EffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(payload: EffectDTO): Promise<void> {
        const { ctx, source, target } = payload;

        let oldDefense: number;
        if (EnemyService.isEnemy(target)) {
            oldDefense = target.value.defense;
            await this.enemyService.setDefense(ctx, target.value.id, 0);
        } else if (PlayerService.isPlayer(target)) {
            oldDefense = target.value.combatState.defense;
            await this.playerService.setDefense(ctx, 0);
        }

        await this.combatQueueService.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Defense,
                defenseDelta: -oldDefense,
                finalDefense: 0,
                healthDelta: undefined,
                finalHealth: undefined,
                statuses: [],
            },
        });
    }
}
