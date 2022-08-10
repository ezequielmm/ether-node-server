import { Injectable } from '@nestjs/common';
import { filter, isEmpty } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusCollection } from 'src/game/status/interfaces';
import { resolve } from 'src/game/status/resolve/constants';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { doubleResolve } from './constants';

@EffectDecorator({
    effect: doubleResolve,
})
@Injectable()
export class DoubleResolveEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const target = dto.target;

        let statuses: StatusCollection;
        if (PlayerService.isPlayer(target)) {
            // Find resolve statuses
            statuses = target.value.combatState.statuses;
        } else if (EnemyService.isEnemy(target)) {
            // Find resolve statuses
            statuses = target.value.statuses;
        }

        const resolveStatuses = filter(statuses.buff, {
            name: resolve.name,
        });

        if (isEmpty(resolveStatuses)) {
            return;
        }

        // Double resolve
        resolveStatuses.forEach((status) => {
            status.args.value *= 2;
        });

        await this.statusService.updateStatuses(
            target,
            dto.ctx.expedition,
            statuses,
        );
    }
}
