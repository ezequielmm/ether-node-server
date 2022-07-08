import { Injectable } from '@nestjs/common';
import { EffectName } from '../effects/effects.enum';
import { DefenseDTO } from '../effects/effects.interface';
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
    effects: [EffectName.Defense],
})
@Injectable()
export class FortitudeStatus implements IBaseStatus {
    async handle(statusDTO: StatusDTO<DefenseDTO>): Promise<DefenseDTO> {
        statusDTO.baseEffectDTO.calculatedValue += statusDTO.args.value;
        return statusDTO.baseEffectDTO;
    }
}
