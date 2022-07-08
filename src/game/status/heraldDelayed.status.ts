import { Injectable } from '@nestjs/common';
import { EffectName } from '../effects/effects.enum';
import { DamageDTO } from '../effects/effects.interface';
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
    effects: [EffectName.Damage],
})
@Injectable()
export class HeraldDelayedStatus implements IBaseStatus {
    async handle(args: StatusDTO<DamageDTO>): Promise<DamageDTO> {
        args.baseEffectDTO.calculatedValue *= 2;
        return args.baseEffectDTO;
    }
}
