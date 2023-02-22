import { Injectable } from '@nestjs/common';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { confusion } from '../confusion/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { clearHeadedStatus } from './constants';

@StatusDecorator({
    status: clearHeadedStatus,
})
@Injectable()
export class ClearHeadedStatus implements StatusEventHandler {
    async handle(args: StatusEventDTO): Promise<any> {
        const { eventArgs, target } = args;

        if (
            eventArgs.status.name === confusion.name &&
            eventArgs.target == target
        ) {
            eventArgs.target = CardTargetedEnum.None;
        }
    }
}
