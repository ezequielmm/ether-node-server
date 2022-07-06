import { Injectable } from '@nestjs/common';
import { EffectName } from '../effects/effects.enum';
import { DamageDTO } from '../effects/effects.interface';
import { Statuses } from './contants';
import { IBaseStatus, StatusDTO } from './interfaces';
import { StatusDecorator } from './status.decorator';

@StatusDecorator({
    status: Statuses.Resolve,
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
