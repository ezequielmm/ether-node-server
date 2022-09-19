import { Injectable, Logger } from '@nestjs/common';

import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { nextPlayerTurnStatus } from './constants';

@StatusDecorator({
    status: nextPlayerTurnStatus,
})
@Injectable()
export class NextPlayerTurnStatus implements StatusEventHandler {
    private readonly logger: Logger = new Logger(NextPlayerTurnStatus.name);

    constructor(private readonly statusService: StatusService) {}

    async handle(dto: StatusEventDTO<Record<string, any>>): Promise<any> {
        const { ctx, source, target, status, remove } = dto;

        this.logger.debug(
            `NextPlayerTurnStatus.handle() source: ${source.value.id} target: ${target.value.id}`,
        );

        await this.statusService.attach({
            ctx,
            statuses: [
                {
                    name: status.args.statusName,
                    args: {
                        attachTo: target.type,
                        ...status.args.statusArgs,
                    },
                },
            ],
            source,
            targetId: target.value.id,
        });

        remove();
    }
}
