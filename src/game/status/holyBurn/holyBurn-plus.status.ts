import { get } from 'lodash';
import { PLAYER_ENERGY_PATH } from 'src/game/components/player/contants';
import { StatusDecorator} from '../status.decorator';
import { holyBurnPlus } from './constants';
import { StatusEventDTO } from '../interfaces';
import { HolyBurnStatus } from './holyBurn.status';

@StatusDecorator({
    status: holyBurnPlus,
})
export class holyBurnPlusStatus extends HolyBurnStatus {
    async handle(dto: StatusEventDTO): Promise<void> {
        const unDeadvalue = dto.status.args.counter;
        const notUnDeadValue = 3;
        await this.holyBurn(dto, unDeadvalue, notUnDeadValue);
        dto.status.args.counter++;
        dto.update(dto.status.args);
    }
}
