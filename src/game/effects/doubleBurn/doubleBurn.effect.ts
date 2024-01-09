import { Injectable } from '@nestjs/common';
import { filter, forEach } from 'lodash';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { burn } from 'src/game/status/burn/constants';
import { StatusCollection } from 'src/game/status/interfaces';
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
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { target, ctx } = dto;

        let statuses: StatusCollection;

        if (PlayerService.isPlayer(target)) {
            statuses = target.value.combatState.statuses;
        } else if (EnemyService.isEnemy(target)) {
            statuses = target.value.statuses;
        }

        console.log("--------------------------------------------------- Debugging Double Burn:")
        console.log("statuses from enemies/player:")
        console.log(statuses)
        console.log("---------------------")
        console.log("---------------------")


        const burnStatuses = filter(statuses.debuff, { name: burn.name });

        console.log("After filtering statuses:")
        console.log(burnStatuses)
        console.log("---------------------")
        console.log("---------------------")
        

        forEach(burnStatuses, (status) => (status.args.counter *= 2));

        console.log("Status after value duplication:")
        console.log(burnStatuses)
        console.log("---------------------")
        console.log("---------------------")


        if (burnStatuses.length) {

            console.log("Finally it sends to persist this statuses:")
            console.log(statuses)


            console.log("---------------------")
            console.log("-------------------------------------------------------End Debugging DDouble Burn")

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
