import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { lastReminderEffect } from './constants';

@EffectDecorator({
    effect: lastReminderEffect,
})
export class LastReminderEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const {
            ctx,
            source,
            target,
            args: { currentValue },
        } = dto;

        
    }
}
