import { Logger } from '@nestjs/common';
import { forEach, get } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PLAYER_ENERGY_PATH } from 'src/game/components/player/contants';
import { damageEffect } from '../damage/constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { holyExplosion } from './constants';
import { EnemyTypeEnum } from 'src/game/components/enemy/enemy.enum';

@EffectDecorator({
    effect: holyExplosion,
})
export class holyExplosionEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(holyExplosion.name);
    constructor(
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;
        const energy = get(ctx.expedition, PLAYER_ENERGY_PATH);
        const unDeadvalue = dto.args.currentValue;
        const notUnDeadValue = 2;
        await this.holyExplosion(dto, energy, unDeadvalue, notUnDeadValue);
    }

    protected async holyExplosion(dto: EffectDTO, energy: number, unDeadvalue: number, notUnDeadValue: number) {
        const { ctx, source, target } = dto;

        //we get the alive enemies in the currentNode
        const currentNodeEnemies = this.enemyService.getLiving(ctx);

        if (!target) {
            this.logger.debug(ctx.info, 'No target found for holyExplosion');
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
                        effect: damageEffect.name,
                        args: {
                            value: unDeadvalue + energy,
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
                        effect: damageEffect.name,
                        args: {
                            value: notUnDeadValue + energy,
                        },
                    },
                });
            }
        }                
    }
}
