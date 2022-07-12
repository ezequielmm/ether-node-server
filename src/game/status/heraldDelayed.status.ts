import { Injectable } from '@nestjs/common';
import { DamageArgs, damageEffect } from '../effects/damage.effect';
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

export const heraldDelayed: Status = {
    name: 'heraldDelayed',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
};

@StatusDecorator({
    status: heraldDelayed,
    effects: [damageEffect],
})
@Injectable()
export class HeraldDelayedStatus implements IBaseStatus {
    async handle(args: StatusDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        args.effectDTO.args.currentValue *= 2;
        return args.effectDTO;
    }
}
