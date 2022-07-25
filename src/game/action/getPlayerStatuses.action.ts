import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { StatusType, AttachedStatus } from '../status/interfaces';

interface GetPlayerStatuses {
    [StatusType.Buff]: AttachedStatus[];
    [StatusType.Debuff]: AttachedStatus[];
}

@Injectable()
export class GetPlayerStatusesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<GetPlayerStatuses> {
        const {
            data: {
                player: { statuses },
            },
        } = await this.expeditionService.getCurrentNode({ clientId });

        return statuses;
    }
}
