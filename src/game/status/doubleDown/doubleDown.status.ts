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
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const {
            effectDTO,
            status: {
                args: { value },
            },
        } = dto;
        effectDTO.args.currentValue *= value;
        return effectDTO;
    }

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const {
            effectDTO,
            status: {
                args: { value },
            },
            remove,
        } = dto;

        effectDTO.args.currentValue *= value;

        remove();

        return effectDTO;
    }
}
