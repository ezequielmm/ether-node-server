import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { GameContext } from 'src/game/components/interfaces';
import { EVENT_BEFORE_ENEMIES_TURN_START } from 'src/game/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { EffectService } from 'src/game/effects/effects.service';

import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { trapped } from './constants';

@StatusDecorator({
    status: trapped,
})
@Injectable()
export class TrappedStatus implements StatusEffectHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly statusService: StatusService,
        private readonly effectService: EffectService,
    ) {}

    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const { ctx, effectDTO } = dto;
        const { source, target } = effectDTO;

        // Deal 12 damage to the player
        await this.effectService.apply({
            ctx,
            source: target,
            target: source,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: 12,
                },
            },
        });

        if (EnemyService.isEnemy(target)) {
            // Update the enemy's script to move to script 4
            await this.enemyService.setCurrentScript(ctx, target.value.id, {
                ...target.value.currentScript,
                next: [{ probability: 1, scriptId: 4 }],
            });
        }

        return effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.removeStatus({
                ctx,
                entity: enemy,
                status: trapped,
            });
        }
    }
}
