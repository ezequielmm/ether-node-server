import { Injectable } from '@nestjs/common';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { doubleBurn } from './constants';
import { burn } from 'src/game/status/burn/constants';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { StatusType } from 'src/game/status/interfaces';

@EffectDecorator({
    effect: doubleBurn,
})
@Injectable()
export class DoubleBurnEffect implements EffectHandler {
    constructor(
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService,
        private readonly enemyService:EnemyService
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { source, target, ctx } = dto;
        const burnValue = dto.args.currentValue;

        console.log("------------------------------------------Debbuging double Burn")
        
        console.log("Burn value:")
        console.log(burnValue)

        console.log("Target:")
        console.log(target)

        //- Apply burn of the card:
        await this.statusService.attach({
            ctx,
            source,
            target,
            statusName: burn.name,
            statusArgs: {
                counter: burnValue
            },
        });

        //- Double all burn status:
        const enemies = this.enemyService.getLiving(ctx);
        enemies.forEach(enemy => {
            const debuffBurn = enemy.value.statuses[StatusType.Debuff].find(status => status.name === burn.name);

            if(debuffBurn){
                const doubledburn = debuffBurn.args.counter *= 2;
                this.enemyService.attach(ctx, enemy.value.id, source, burn.name, {counter: doubledburn})
            }
        })



    }
}
