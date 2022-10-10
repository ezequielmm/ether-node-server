import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { confusion } from 'src/game/status/confusion/constants';
import { StatusCollection } from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { removeConfusionEffect } from './constants';

@EffectDecorator({
    effect: removeConfusionEffect,
})
@Injectable()
export class RemoveConfusionEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx, target } = dto;
        let statuses: StatusCollection;

        if (PlayerService.isPlayer(target)) {
            statuses = target.value.combatState.statuses;
        } else if (EnemyService.isEnemy(target)) {
            statuses = target.value.statuses;
        }

        statuses.debuff = statuses.debuff.filter(
            (status) => status.name !== confusion.name,
        );

        await this.statusService.updateStatuses(ctx, target, statuses);
    }
}
