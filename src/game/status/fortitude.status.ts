import { Injectable } from '@nestjs/common';
import { EffectName } from '../effects/effects.enum';
import { DefenseDTO } from '../effects/effects.interface';
import { Statuses } from './contants';
import { IBaseStatus, StatusDTO } from './interfaces';
import { StatusDecorator } from './status.decorator';

@StatusDecorator({
    status: Statuses.Fortitude,
    effects: [EffectName.Defense],
})
@Injectable()
export class FortitudeStatus implements IBaseStatus {
    async handle(statusDTO: StatusDTO<DefenseDTO>): Promise<DefenseDTO> {
        statusDTO.baseEffectDTO.calculatedValue += statusDTO.args.value;
        return statusDTO.baseEffectDTO;
    }
}
