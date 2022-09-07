import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    OnBeginCardPlayEventArgs,
    StatusEventDTO,
    StatusEventHandler,
} from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { regeneration } from './constants';

@StatusDecorator({
    status: regeneration,
})
export class RegenerationStatus implements StatusEventHandler {
    constructor(
        private readonly statusService: StatusService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async enemyHandler(
        dto: StatusEventDTO<OnBeginCardPlayEventArgs>,
    ): Promise<void> {
        const {
            args: {
                card,
                cardSourceReference: sourceReference,
                cardTargetId: targetId,
            },
        } = dto;

        const {
            properties: { statuses },
        } = card;

        const expedition = await this.expeditionService.findOne({
            clientId: dto.ctx.expedition.clientId,
        });

        await this.statusService.attach({
            ctx: dto.ctx,
            statuses,
            currentRound: expedition.currentNode.data.round,
            sourceReference,
            targetId,
        });

        dto.remove();
    }
}
