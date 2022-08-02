import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { EffectService } from 'src/game/effects/effects.service';
import {
    OnBeginCardPlayEventArgs,
    StatusEventDTO,
    StatusEventHandler,
} from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { imbued } from './constants';

@StatusDecorator({
    status: imbued,
})
export class ImbuedStatus implements StatusEventHandler {
    constructor(
        private readonly statusService: StatusService,
        private readonly effectService: EffectService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(dto: StatusEventDTO<OnBeginCardPlayEventArgs>): Promise<void> {
        const {
            ctx,
            args: {
                card,
                cardSource: source,
                cardSourceReference: sourceReference,
                cardTargetId: targetId,
            },
        } = dto;

        const {
            properties: { effects, statuses },
        } = card;

        const expedition = await this.expeditionService.findOne({
            clientId: dto.ctx.expedition.clientId,
        });

        await this.effectService.applyAll({
            ctx,
            source,
            effects,
            selectedEnemy: targetId,
        });

        await this.statusService.attachStatuses({
            ctx: dto.ctx,
            statuses,
            currentRound: expedition.currentNode.data.round,
            sourceReference,
            targetId,
        });

        dto.remove();
    }
}
