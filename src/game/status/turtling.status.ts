import { EffectName } from '../effects/effects.enum';
import { DefenseDTO } from '../effects/effects.interface';
import { Statuses } from './contants';
import { IBaseStatus, StatusDTO } from './interfaces';
import { StatusDecorator } from './status.decorator';

@StatusDecorator({
    status: Statuses.Turtling,
    effects: [EffectName.Defense],
})
export class TurtlingStatus implements IBaseStatus {
    async handle(statusDto: StatusDTO): Promise<DefenseDTO> {
        statusDto.baseEffectDTO.calculatedValue *= 2;
        return statusDto.baseEffectDTO;
    }
}
