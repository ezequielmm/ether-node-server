import { Injectable } from '@nestjs/common';
import { filter, forEach } from 'lodash';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { burn } from 'src/game/status/burn/constants';
import { StatusCollection, StatusesGlobalCollection } from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { StatusGenerator } from 'src/game/status/statusGenerator';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { doubleBurn } from './constants';

@EffectDecorator({
    effect: doubleBurn,
})
@Injectable()
export class DoubleBurnEffect implements EffectHandler {
    constructor(
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService,
        private readonly enemyService: EnemyService
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { target, ctx } = dto;

        //let statuses: StatusCollection;

        // if (PlayerService.isPlayer(target)) {
        //     statuses = target.value.combatState.statuses;
        // } else if (EnemyService.isEnemy(target)) {
        //     statuses = target.value.statuses;
        // }

        let statuses: StatusCollection = this.enemyService.getEnemyStatuses(dto.ctx)[0].statuses;

        const burnStatuses = filter(statuses.debuff, { name: burn.name });

        console.log("------------------------------------------ Debugging")
        console.log(statuses)

        forEach(burnStatuses, (status) => (status.args.counter *= 2));

        if (burnStatuses.length) {

            await this.statusService.updateStatuses(ctx, target, statuses);

            await this.combatQueueService.push({
                ctx: dto.ctx,
                source: dto.source,
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Status,
                    statuses: burnStatuses.map((status) => ({
                        name: status.name,
                        description: StatusGenerator.generateDescription(
                            status.name,
                            status.args.counter,
                        ),
                        counter: status.args.counter,
                    })),
                },
            });
        }
    }
}
