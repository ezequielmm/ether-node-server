import { get } from 'lodash';
import { PLAYER_ENERGY_PATH } from 'src/game/components/player/contants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO } from '../effects.interface';
import { flurryPlus } from './constants';
import { FlurryEffect } from './flurry.effect';

@EffectDecorator({
    effect: flurryPlus,
})
export class FlurryPlusEffect extends FlurryEffect {
    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;
        const energy = get(ctx.expedition, PLAYER_ENERGY_PATH);
        await this.flurry(dto, energy + 1);
    }
}
