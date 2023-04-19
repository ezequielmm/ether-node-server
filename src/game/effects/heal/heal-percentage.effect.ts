import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionEntity, GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { healEffect, healPercentageEffect } from './constants';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { isFloat } from 'src/utils';

export interface HealPercentageArgs {
    value: number;
}

@EffectDecorator({
    effect: healPercentageEffect,
})
@Injectable()
export class HealPercentageEffect implements EffectHandler {
    constructor(
        private readonly effectService: EffectService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(payload: EffectDTO<HealPercentageArgs>): Promise<void> {
        const ctx = payload.ctx;
        const source = payload.source;
        const percentage = payload.args.currentValue;

        const hp = this.calculatePercentage(source, percentage, ctx);

        await this.effectService.apply({
            ctx,
            source,
            target: source,
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
        ctx: GameContext,
    ): number {
        let newHpCurrent = 0;
        const convertedPercentage = isFloat(percentage)
            ? percentage
            : percentage / 100;

        if (PlayerService.isPlayer(entity)) {
            const isCombatNode = this.expeditionService.isPlayerInCombat(ctx);

            const hpMax = isCombatNode
                ? entity.value.combatState.hpMax
                : entity.value.globalState.hpMax;

            newHpCurrent = Math.round(hpMax * convertedPercentage);
        }

        if (EnemyService.isEnemy(entity)) {
            const hpMax = entity.value.hpMax;
            const hpCurrent = entity.value.hpCurrent;

            const hpToAdd = Math.round(hpMax * convertedPercentage);

            newHpCurrent = Math.min(hpMax, hpCurrent + hpToAdd);
        }

        return newHpCurrent;
    }
}
