import { DefenseArgs } from '../effects/defense.effect';
import { defenseEffect } from '../effects/constants';
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

export const turtling: StatusEffect = {
    name: 'turtling',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [defenseEffect],
};
@StatusDecorator({
    status: turtling,
})
export class TurtlingStatus implements StatusEffectHandler {
    async handle(
        dto: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        dto.effectDTO.args.currentValue *= 2;
        return dto.effectDTO;
    }
}
