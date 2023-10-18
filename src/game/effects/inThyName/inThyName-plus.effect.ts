import { get } from 'lodash';
import { PLAYER_ENERGY_PATH } from 'src/game/components/player/contants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO } from '../effects.interface';
import { inThyNamePlus } from './constants';
import { inThyNameEffect } from './inThyName.effect';

@EffectDecorator({
    effect: inThyNamePlus,
})
export class inThyNamePlusEffect extends inThyNameEffect {
    async handle(dto: EffectDTO): Promise<void> {
        const unDeadvalue = dto.args.currentValue;
        const notUnDeadValue = 5;
        await this.inThyName(dto, unDeadvalue, notUnDeadValue);
    }
}
