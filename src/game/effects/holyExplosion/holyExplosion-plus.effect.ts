import { get } from 'lodash';
import { PLAYER_ENERGY_PATH } from 'src/game/components/player/contants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO } from '../effects.interface';
import { holyExplosionPlus } from './constants';
import { holyExplosionEffect } from './holyExplosion.effect';

@EffectDecorator({
    effect: holyExplosionPlus,
})
export class holyExplosionPlusEffect extends holyExplosionEffect {
    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;
        const energy = get(ctx.expedition, PLAYER_ENERGY_PATH);
        const unDeadvalue = dto.args.currentValue;
        const notUnDeadValue = 3;
        await this.holyExplosion(dto, energy, unDeadvalue, notUnDeadValue);
    }
}
