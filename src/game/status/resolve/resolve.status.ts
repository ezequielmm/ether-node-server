import { Injectable } from '@nestjs/common';
import { DamageArgs } from '../../effects/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { resolve } from './constants';

@StatusDecorator({
    status: resolve,
})
@Injectable()
export class ResolveStatus implements StatusEffectHandler {
    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const effectDTO = dto.effectDTO;
        effectDTO.args.currentValue = Math.max(
            effectDTO.args.currentValue + dto.args.value,
            0,
        );
        return effectDTO;
    }
}
