import { get } from 'lodash';
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
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx, source, target } = dto;

        const energy = get(ctx.expedition, PLAYER_ENERGY_PATH);

        for (let i = 0; i < energy; i++) {
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
