import { Injectable } from '@nestjs/common';
import { DefenseArgs } from '../../effects/defense/defense.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectHandler, StatusEffectDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { fortitude } from './constants';

@StatusDecorator({
    status: fortitude,
})
@Injectable()
export class FortitudeStatus implements StatusEffectHandler {
    async preview(
        args: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        return this.handle(args);
    }

    async handle(
        dto: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        dto.effectDTO.args.currentValue += dto.status.args.counter;
        return dto.effectDTO;
    }
}
