import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { energyEffect } from '../energy/constants';
import { onARoll } from './constants';

@EffectDecorator({
    effect: onARoll,
})
@Injectable()
export class OnARollEffect implements EffectHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly effectService: EffectService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx, source, target, args } = dto;
        if (EnemyService.isEnemy(target) && this.enemyService.isDead(target)) {
            await this.effectService.apply({
                ctx,
                source: source,
                target: source,
                effect: {
                    effect: energyEffect.name,
                    target: source.type,
                    args: {
                        value: args.currentValue,
                    },
                },
            });
        }
    }
}
