import { Injectable } from '@nestjs/common';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { doubleDown } from './contants';

@StatusDecorator({
    status: doubleDown,
})
@Injectable()
export class DoubleDownStatus implements StatusEffectHandler {
    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const effectDTO = dto.effectDTO;

        effectDTO.args.currentValue =
            effectDTO.args.currentValue * dto.status.args.value;

        return effectDTO;
    }
}
