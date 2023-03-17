import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { burn } from 'src/game/status/burn/constants';
import { regeneration } from 'src/game/status/regeneration/contants';
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

        // Here we check if the target has any burn status
        // if it does, the source get the regeneration status
        let hasBurnStatus = false;

        if (EnemyService.isEnemy(target)) {
            hasBurnStatus = target.value.statuses.debuff.some(
                (status) => status.name === burn.name,
            );
        }

        if (PlayerService.isPlayer(target)) {
            hasBurnStatus = target.value.combatState.statuses.debuff.some(
                (status) => status.name === burn.name,
            );
        }

        if (hasBurnStatus) {
            await this.statusService.attach({
                ctx,
                target: source,
                source: target,
                statusName: regeneration.name,
                statusArgs: { counter: currentValue },
            });
        }
    }
}
