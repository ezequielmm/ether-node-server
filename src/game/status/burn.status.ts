import { Injectable } from '@nestjs/common';
import { damageEffect } from '../effects/constants';
import { JsonEffect } from '../effects/effects.interface';
import { EffectService } from '../effects/effects.service';
import {
    StatusEvent,
    StatusEventDTO,
    StatusEventHandler,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from './interfaces';
import { StatusDecorator } from './status.decorator';
import { StatusService } from './status.service';

export const burn: StatusEvent = {
    name: 'burn',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnTurnEnd,
};
@StatusDecorator({
    status: burn,
})
@Injectable()
export class BurnStatus implements StatusEventHandler {
    constructor(
        private readonly effectService: EffectService,
        private readonly statusService: StatusService,
    ) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const source = await this.statusService.getSourceFromReference(
            dto.client,
            dto.source,
        );
        const effect: JsonEffect = {
            effect: damageEffect.name,
            args: {
                value: dto.args.value,
            },
        };

        await this.effectService.processEffect(
            dto.client,
            source,
            dto.target,
            effect,
            dto.currentRound,
        );
    }
}
