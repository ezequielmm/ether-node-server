import { EffectService } from 'src/game/effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
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
    ) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const {
            ctx,
            eventArgs: { card, cardSource: source, cardTargetId: targetId },
        } = dto;

        const {
            properties: { effects, statuses },
        } = card;

        await this.effectService.applyAll({
            ctx,
            source,
            effects,
            selectedEnemy: targetId,
        });

        await this.statusService.attachAll({
            ctx: dto.ctx,
            statuses,
            source,
            targetId,
        });

        dto.remove();
    }
}