import { Logger } from '@nestjs/common';
import { get } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PLAYER_ENERGY_PATH } from 'src/game/components/player/contants';
import { damageEffect } from '../damage/constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { flurry } from './constants';

@EffectDecorator({
    effect: flurry,
})
export class FlurryEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(FlurryEffect.name);
    constructor(
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx, source } = dto;
        let { target } = dto;

        const energy = get(ctx.expedition, PLAYER_ENERGY_PATH);

        for (let i = 0; i < energy; i++) {
            if (
                EnemyService.isEnemy(target) &&
                this.enemyService.isDead(target)
            ) {
                this.logger.log('Enemy is dead, looking for other enemies');
                target = this.enemyService.getRandom(ctx);
            }

            if (!target) {
                this.logger.error('No target found for Flurry');
                return;
            }

            await this.effectService.apply({
                ctx: dto.ctx,
                source,
                target,
                effect: {
                    effect: damageEffect.name,
                    args: {
                        value: dto.args.currentValue,
                    },
                },
            });
        }
    }
}
