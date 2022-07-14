import { Injectable } from '@nestjs/common';
import { damageEffect } from '../effects/constants';
import { DamageArgs } from '../effects/damage.effect';
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

export const heraldDelayed: StatusEffect = {
    name: 'heraldDelayed',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};

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
