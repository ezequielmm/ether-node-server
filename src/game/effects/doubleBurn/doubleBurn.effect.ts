import { Injectable } from '@nestjs/common';
import { filter, forEach } from 'lodash';
import { burn } from 'src/game/status/burn/constants';
import { StatusCollection } from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { doubleBurn } from './constants';

@EffectDecorator({
    effect: doubleBurn,
})
@Injectable()
export class DoubleBurnEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { target, expedition } = dto;

        let statuses: StatusCollection;

        if (EffectService.isPlayer(target)) {
            statuses = target.value.combatState.statuses;
        } else if (EffectService.isEnemy(target)) {
            statuses = target.value.statuses;
        }

        forEach(
            filter(statuses[burn.type], { name: burn.name }),
            (status) => (status.args.value *= 2),
        );

        if (statuses) {
            await this.statusService.updateStatuses(
                target,
                expedition,
                statuses,
            );
        }
    }
}
