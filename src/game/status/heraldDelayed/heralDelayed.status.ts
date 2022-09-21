import { Injectable } from '@nestjs/common';
import { heraldingStatus } from '../heralding/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { heraldDelayedStatus } from './constants';

@StatusDecorator({
    status: heraldDelayedStatus,
})
@Injectable()
export class HeralDelayedStatus implements StatusEventHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: StatusEventDTO<Record<string, any>>): Promise<any> {
        const { ctx, source, target, remove } = dto;

        await this.statusService.attach({
            ctx,
            statuses: [
                {
                    name: heraldingStatus.name,
                    args: {
                        attachTo: target.type,
                        counter: 1,
                    },
                },
            ],
            source,
            targetId: target.value.id,
        });

        remove();
    }
}
