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

    protected async flurry(dto: EffectDTO, times: number) {
        const { ctx, source } = dto;
        let { target } = dto;

        for (let i = 0; i < times; i++) {
            if (
                EnemyService.isEnemy(target) &&
                this.enemyService.isDead(target)
            ) {
                this.logger.log(
                    ctx.info,
                    'Enemy is dead, looking for other enemies',
                );
                target = this.enemyService.getRandom(ctx);
            }

            if (!target) {
                this.logger.error(ctx.info, 'No target found for Flurry');
                return;
            }

            await this.effectService.apply({
                ctx,
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

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;
        const energy = get(ctx.expedition, PLAYER_ENERGY_PATH);
        await this.flurry(dto, energy);
    }
}
