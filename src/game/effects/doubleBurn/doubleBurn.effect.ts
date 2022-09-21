import { Injectable } from '@nestjs/common';
import { filter, forEach } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { burn } from 'src/game/status/burn/constants';
import { StatusCollection } from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { doubleBurn } from './constants';

@EffectDecorator({
    effect: doubleBurn,
})
@Injectable()
export class DoubleBurnEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const {
            target,
            ctx: { expedition },
        } = dto;

        let statuses: StatusCollection;

        if (PlayerService.isPlayer(target)) {
            statuses = target.value.combatState.statuses;
        } else if (EnemyService.isEnemy(target)) {
            statuses = target.value.statuses;
        }

        const burnStatuses = filter(statuses.debuff, { name: burn.name });

        forEach(burnStatuses, (status) => (status.args.counter *= 2));

        if (burnStatuses.length) {
            await this.statusService.updateStatuses(
                target,
                expedition,
                statuses,
            );
        }
    }
}
