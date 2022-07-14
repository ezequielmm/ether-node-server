import { Injectable } from '@nestjs/common';
import { dodgeEffect } from '../effects/constants';
import { EffectDTO } from '../effects/effects.interface';
import { DamageArgs } from '../effects/damage.effect';
import {
    IBaseStatus,
    Status,
    StatusDirection,
    StatusDTO,
    StatusStartsAt,
    StatusType,
} from './interfaces';
import { StatusDecorator } from './status.decorator';

export const dodge: Status = {
    name: 'dodge',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
};
@StatusDecorator({
    status: dodge,
    effects: [dodgeEffect],
})
@Injectable()
export class DodgeStatus implements IBaseStatus {
    async handle(dto: StatusDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        dto.effectDTO.args.currentValue = 0;
        return dto.effectDTO;
    }
}
