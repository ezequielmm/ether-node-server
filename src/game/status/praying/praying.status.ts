import { Injectable } from '@nestjs/common';
import { fortitude } from '../fortitude/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { resolveStatus } from '../resolve/constants';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { prayingStatus } from './constants';

@StatusDecorator({
    status: prayingStatus,
})
@Injectable()
export class PrayingStatus implements StatusEventHandler {
    constructor(private readonly statuService: StatusService) {}

    async handle(dto: StatusEventDTO): Promise<any> {
        const { ctx, update, remove, status, source, target } = dto;

        await this.statuService.attach({
            ctx,
            source,
            target,
            statusName: fortitude.name,
            statusArgs: {
                counter: 1,
            },
        });

        await this.statuService.attach({
            ctx,
            source,
            target,
            statusName: resolveStatus.name,
            statusArgs: {
                counter: 1,
            },
        });

        // Decrease counter
        status.args.counter--;

        // Remove status if counter is 0
        if (status.args.counter === 0) {
            remove();
        } else {
            update(status.args);
        }
    }
}
