import { Injectable } from '@nestjs/common';
import { sampleSize } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusCollection } from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { removeDebuff } from './contants';

@EffectDecorator({
    effect: removeDebuff,
})
@Injectable()
export class RemoveDebuffEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { target, args } = dto;

        let statuses: StatusCollection;

        if (PlayerService.isPlayer(target)) {
            statuses = target.value.combatState.statuses;
        } else if (EnemyService.isEnemy(target)) {
            statuses = target.value.statuses;
        }

        statuses.debuff = Number.isFinite(args.currentValue)
            ? []
            : sampleSize(
                  statuses.debuff,
                  statuses.debuff.length - args.currentValue,
              );

        await this.statusService.updateStatuses(dto.ctx, target, statuses);
    }
}
