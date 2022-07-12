import { DefenseArgs } from '../effects/defense.effect';
import { defenseEffect } from '../effects/constants';
import { EffectDTO } from '../effects/effects.interface';
import {
    IBaseStatus,
    Status,
    StatusDirection,
    StatusDTO,
    StatusStartsAt,
    StatusType,
} from './interfaces';
import { StatusDecorator } from './status.decorator';

export const turtling: Status = {
    name: 'turtling',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
};
@StatusDecorator({
    status: turtling,
    effects: [defenseEffect],
})
export class TurtlingStatus implements IBaseStatus {
    async handle(dto: StatusDTO<DefenseArgs>): Promise<EffectDTO<DefenseArgs>> {
        dto.effectDTO.args.currentValue *= 2;
        return dto.effectDTO;
    }
}
