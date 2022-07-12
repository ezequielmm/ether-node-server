import { Injectable } from '@nestjs/common';
import { defenseEffect } from '../effects/constants';
import { DefenseArgs } from '../effects/defense.effect';
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

export const fortitude: Status = {
    name: 'fortitude',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
};
@StatusDecorator({
    status: fortitude,
    effects: [defenseEffect],
})
@Injectable()
export class FortitudeStatus implements IBaseStatus {
    async handle(dto: StatusDTO<DefenseArgs>): Promise<EffectDTO<DefenseArgs>> {
        dto.effectDTO.args.currentValue += dto.args.value;
        return dto.effectDTO;
    }
}
