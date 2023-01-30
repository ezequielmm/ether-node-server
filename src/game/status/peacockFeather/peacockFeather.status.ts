import { Injectable } from '@nestjs/common';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { peacockFeatherStatus } from './constants';

@StatusDecorator({
    status: peacockFeatherStatus,
})
@Injectable()
export class PeacockFeatherStatus implements StatusEventHandler {
    async handle(dto: StatusEventDTO): Promise<void> {
        const {
            status: { args },
            eventArgs: { card },
        } = dto;

        if (args.counter >= args.value) {
            args.counter = 1;
            card.energy = 0;
            dto.update(args);
        } else {
            args.counter++;
            dto.update(args);
        }
    }
}
