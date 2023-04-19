import { Injectable } from '@nestjs/common';
import { healEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { ExpeditionEntity, GameContext } from 'src/game/components/interfaces';
import { ExpeditionEnemy } from 'src/game/components/enemy/enemy.interface';
import { ExpeditionPlayer } from 'src/game/components/player/interfaces';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

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
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(payload: EffectDTO<HealArgs>): Promise<void> {
        const {
            ctx,
            source,
            target,
            args: { currentValue: hpDelta },
        } = payload;

        // Here we check is the target to heal is the player
        if (PlayerService.isPlayer(target)) {
            if (this.playerService.isDead(ctx)) return;

            await this.applyHPToPlayer(ctx, target, hpDelta);
            return;
        }

        // And here we check is the target to heal is the enemy
        if (EnemyService.isEnemy(target)) {
            if (this.enemyService.isDead(target)) return;

            await this.applyHPToEnemy(ctx, source, target, hpDelta);
            return;
        }
    }

    private async applyHPToPlayer(
        ctx: GameContext,
        target: ExpeditionPlayer,
        newHP: number,
    ): Promise<void> {
        const isCombat = this.expeditionService.isPlayerInCombat(ctx);

        const hpCurrent = target.value.combatState.hpCurrent;

        const finalHealth = await this.playerService.setHPDelta({
            ctx,
            hpDelta: newHP,
        });

        if (isCombat) {
            const healhDelta = finalHealth - hpCurrent;

            await this.sendToCombatQueue(
                ctx,
                target,
                target,
                healhDelta,
                finalHealth,
            );
        }
    }

    private async applyHPToEnemy(
        ctx: GameContext,
        source: ExpeditionEntity,
        enemy: ExpeditionEnemy,
        hp: number,
    ): Promise<void> {
        const hpCurrent = enemy.value.hpCurrent;
        const newHp = await this.enemyService.setHp(
            ctx,
            enemy.value.id,
            enemy.value.hpCurrent + hp,
        );
        await this.sendToCombatQueue(
            ctx,
            source,
            enemy,
            newHp - hpCurrent,
            newHp,
        );
    }

    private async sendToCombatQueue(
        ctx: GameContext,
        source: ExpeditionEntity,
        target: ExpeditionEntity,
        healthDelta: number,
        finalHealth: number,
    ): Promise<void> {
        await this.combatQueueService.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Heal,
                defenseDelta: 0,
                finalDefense: 0,
                healthDelta,
                finalHealth,
                statuses: [],
            },
        });
    }
}
