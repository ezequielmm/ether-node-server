import { Injectable } from '@nestjs/common';
import { EffectName } from '../effects/effects.enum';
import { DamageDTO } from '../effects/effects.interface';
import { Statuses } from './contants';
import { IBaseStatus, StatusDTO } from './interfaces';
import { StatusDecorator } from './status.decorator';

@StatusDecorator({
    status: Statuses.HeraldDelayed,
    effects: [EffectName.Damage],
})
@Injectable()
export class HeraldDelayedStatus implements IBaseStatus {
    async handle(args: StatusDTO<DamageDTO>): Promise<DamageDTO> {
        args.baseEffectDTO.calculatedValue *= 2;
        return args.baseEffectDTO;
    }
}
