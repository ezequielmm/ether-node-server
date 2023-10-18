import { Logger } from '@nestjs/common';
import { forEach, get } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { inThyName } from './constants';
import { EnemyTypeEnum } from 'src/game/components/enemy/enemy.enum';
import { defenseEffect } from '../defense/constants';

@EffectDecorator({
    effect: inThyName,
})
export class inThyNameEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(inThyName.name);
    constructor(
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;
        const unDeadvalue = dto.args.currentValue;
        const notUnDeadValue = 3;
        await this.inThyName(dto, unDeadvalue, notUnDeadValue);
    }

    protected async inThyName(dto: EffectDTO, unDeadvalue: number, notUnDeadValue: number) {
        const { ctx, source, target } = dto;

        //we get the alive enemies in the currentNode
        const currentNodeEnemies = this.enemyService.getLiving(ctx);

        if (!target) {
            this.logger.debug(ctx.info, 'No target found for inThyName');
            return;
        }

        //we iterate all enemies
        for(let currentEnemy of currentNodeEnemies){

            const enemyType = currentEnemy.value.type;
    
            //depending if is undead or not, we apply the damageEffect
            if(enemyType == EnemyTypeEnum.Undead){
                
                await this.effectService.apply({
                    ctx,
                    source,
                    target,
                    effect: {
                        effect: defenseEffect.name,
                        args: {
                            value: unDeadvalue,
                        },
                    },
                });
            }
            else{  
                
                await this.effectService.apply({
                    ctx,
                    source,
                    target,
                    effect: {
                        effect: defenseEffect.name,
                        args: {
                            value: notUnDeadValue,
                        },
                    },
                });
            }
        }                
    }
}
