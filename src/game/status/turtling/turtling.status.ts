import { DefenseArgs } from '../../effects/defense/defense.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectHandler, StatusEffectDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { turtling } from './constants';

@StatusDecorator({
    status: turtling,
})
export class TurtlingStatus implements StatusEffectHandler {
    async preview(
        args: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        return this.handle(args);
    }

    async handle(
        dto: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        dto.effectDTO.args.currentValue *= 2;
        return dto.effectDTO;
    }
}
