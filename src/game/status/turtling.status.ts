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

export const turtling: Status = {
    name: 'turtling',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
};
@StatusDecorator({
    status: turtling,
    effects: [EffectName.Defense],
})
export class TurtlingStatus implements IBaseStatus {
    async handle(statusDto: StatusDTO): Promise<DefenseDTO> {
        statusDto.baseEffectDTO.calculatedValue *= 2;
        return statusDto.baseEffectDTO;
    }
}
