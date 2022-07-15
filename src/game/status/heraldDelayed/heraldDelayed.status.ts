import { Injectable } from '@nestjs/common';
import { DamageArgs } from '../../effects/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectHandler, StatusEffectDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { heraldDelayed } from './constants';

@StatusDecorator({
    status: heraldDelayed,
})
@Injectable()
export class HeraldDelayedStatus implements StatusEffectHandler {
    async handle(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        args.effectDTO.args.currentValue *= 2;
        return args.effectDTO;
    }
}
