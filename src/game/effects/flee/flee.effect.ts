import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { fleeEffect } from './constants';

@EffectDecorator({
    effect: fleeEffect,
})
@Injectable()
export class FleeEffect implements EffectHandler {
    constructor(private readonly enemyService: EnemyService) {}

    async handle(payload: EffectDTO): Promise<void> {
        const { target, ctx } = payload;

        // We know that the target is the enemy we have to remove from the enemies array
        // We query that array first to remove it and then evaluate
    }
}
