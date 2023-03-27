import { Injectable } from '@nestjs/common';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { intercept } from './constants';

@StatusDecorator({
    status: intercept,
})
@Injectable()
export class InterceptStatus implements StatusEffectHandler {
    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const effectDTO = dto.effectDTO;

        effectDTO.args.currentValue = Math.max(
            Math.ceil(effectDTO.args.currentValue / 2),
            0,
        );

        return effectDTO;
    }
}
