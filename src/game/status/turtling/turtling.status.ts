import { DefenseArgs } from '../../effects/defense/defense.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectHandler, StatusEffectDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { turtling } from './constants';

@StatusDecorator({
    status: turtling,
})
export class TurtlingStatus implements StatusEffectHandler {
    async handle(
        dto: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        dto.effectDTO.args.currentValue *= 2;
        return dto.effectDTO;
    }
}
