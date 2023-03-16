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

        // Here we check is the target to heal is the player
        if (PlayerService.isPlayer(target)) {
            if (this.playerService.isDead(ctx)) return;

            await this.applyHPToPlayer(ctx, source, target, hpToAdd);
        }

        // And here we check is the target to heal is the enemy
        if (EnemyService.isEnemy(target)) {
            if (this.enemyService.isDead(target)) return;

            await this.applyHPToEnemy(ctx, source, target, hpToAdd);
        }
    }

    private async applyHPToPlayer(
        ctx: GameContext,
        source: ExpeditionEntity,
        player: ExpeditionPlayer,
        hp: number,
    ): Promise<void> {
        const hpCurrent = player.value.combatState.hpCurrent;

        await this.playerService.setGlobalHp(
            ctx,
            player.value.combatState.hpCurrent + hp,
        );

        const newHp = await this.playerService.setHp(
            ctx,
            player.value.combatState.hpCurrent + hp,
        );

        await this.sendToCombatQueue(
            ctx,
            source,
            player,
            newHp - hpCurrent,
            newHp,
        );
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
            ctx: ctx,
            source: source,
            target: target,
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
