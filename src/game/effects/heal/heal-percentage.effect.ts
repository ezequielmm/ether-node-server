import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionEntity } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { healEffect, healPercentageEffect } from './constants';

export interface HealPercentageArgs {
    value: number;
}

@EffectDecorator({
    effect: healPercentageEffect,
})
@Injectable()
export class HealPercentageEffect implements EffectHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(payload: EffectDTO<HealPercentageArgs>): Promise<void> {
        const ctx = payload.ctx;
        const source = payload.source;
        const target = payload.target;
        const percentage = payload.args.currentValue;

        const hp = this.calculatePercentage(target, percentage);

        await this.effectService.apply({
            ctx,
            source,
            target,
            effect: {
                effect: healEffect.name,
                args: {
                    value: hp,
                },
            },
        });
    }

    private calculatePercentage(
        entity: ExpeditionEntity,
        percentage: number,
    ): number {
        const hpMax = PlayerService.isPlayer(entity)
            ? entity.value.combatState.hpMax
            : EnemyService.isEnemy(entity)
            ? entity.value.hpMax
            : Number.NaN;

        return Math.round(hpMax * (percentage / 100));
    }
}
