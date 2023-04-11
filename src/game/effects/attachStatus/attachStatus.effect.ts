import { Injectable } from '@nestjs/common';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { attachStatusEffect } from './constants';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';

@EffectDecorator({
    effect: attachStatusEffect,
})
@Injectable()
export class AttachStatusEffect implements EffectHandler {
    constructor(
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(payload: EffectDTO): Promise<void> {
        const { ctx, source, target, args, action } = payload;

        await this.statusService.attach({
            ctx,
            source,
            target,
            statusName: args.statusName,
            statusArgs: args.statusArgs,
            action: action,
        });

        await this.combatQueueService.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Status,
                statuses: [],
            },
            action: action,
        });
    }
}
