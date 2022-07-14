import { Injectable } from '@nestjs/common';
import { damageEffect } from '../effects/constants';
import { DamageArgs } from '../effects/damage.effect';
import { EffectDTO } from '../effects/effects.interface';
import {
    StatusDirection,
    StatusEffectDTO,
    StatusEffect,
    StatusEffectHandler,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from './interfaces';
import { StatusDecorator } from './status.decorator';

export const resolve: StatusEffect = {
    name: 'resolve',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};

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
