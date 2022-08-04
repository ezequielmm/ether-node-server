import { Injectable } from '@nestjs/common';
import { healEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';

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
    ) {}

    async handle(payload: EffectDTO<HealArgs>): Promise<void> {
        const {
            ctx,
            target,
            args: { currentValue },
        } = payload;

        if (EffectService.isPlayer(target))
            await this.playerService.setHp(ctx, currentValue);
        else if (EffectService.isEnemy(target))
            await this.enemyService.setHp(ctx, target.value.id, currentValue);
    }
}
