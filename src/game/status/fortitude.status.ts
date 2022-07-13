import { Injectable } from '@nestjs/common';
import { defenseEffect } from '../effects/constants';
import { DefenseArgs } from '../effects/defense.effect';
import { EffectDTO } from '../effects/effects.interface';
import {
    StatusEffectHandler,
    StatusDirection,
    StatusEffectDTO,
    StatusStartsAt,
    StatusType,
    StatusEffect,
    StatusTrigger,
} from './interfaces';
import { StatusDecorator } from './status.decorator';

export const fortitude: StatusEffect = {
    name: 'fortitude',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [defenseEffect],
};
@StatusDecorator({
    status: fortitude,
})
@Injectable()
export class FortitudeStatus implements StatusEffectHandler {
    async handle(
        dto: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        dto.effectDTO.args.currentValue += dto.args.value;
        return dto.effectDTO;
    }
}
