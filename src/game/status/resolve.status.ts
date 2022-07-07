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

export const resolve: Status = {
    name: 'resolve',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
};

@StatusDecorator({
    status: resolve,
    effects: [EffectName.Damage],
})
@Injectable()
export class ResolveStatus implements IBaseStatus {
    async handle(dto: StatusDTO<DamageDTO>): Promise<DamageDTO> {
        dto.baseEffectDTO.calculatedValue = Math.max(
            dto.baseEffectDTO.calculatedValue + dto.args.value,
            0,
        );
        return dto.baseEffectDTO;
    }
}
