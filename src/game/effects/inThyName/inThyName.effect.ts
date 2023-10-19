import { Logger } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { inThyNameEffect } from './constants';
import { EnemyTypeEnum } from 'src/game/components/enemy/enemy.enum';
import { defenseEffect } from '../defense/constants';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { clearConfigCache } from 'prettier';

export interface InThyNameArgs {
    undeadDefense: number,
    notUndeadDefense: number,
}
@EffectDecorator({
    effect: inThyNameEffect,
})
export class InThyNameEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(inThyNameEffect.name);
    constructor(
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
        private readonly combatQueueService: CombatQueueService
    ) {}

    async handle(dto: EffectDTO<InThyNameArgs>): Promise<void> {
        const { ctx } = dto;
        await this.inThyName(dto);
    }

    protected async inThyName(dto: EffectDTO<InThyNameArgs>) {
        const { ctx, source, target, action } = dto;

        //we get the alive enemies in the currentNode
        const currentNodeEnemies = this.enemyService.getLiving(ctx);

        if (!target) {
            this.logger.debug(ctx.info, 'No target found for inThyName');
            return;
        }

        console.log(target);
        console.log(currentNodeEnemies);
        
        //we iterate all enemies
        for(let currentEnemy of currentNodeEnemies){

            const enemyType = currentEnemy.value.type;
            console.log(enemyType);
            //depending if is undead or not, we apply the damageEffect
            if(enemyType == EnemyTypeEnum.Undead){
                
                await this.effectService.apply({
                    ctx,
                    source,
                    target,
                    effect: {
                        effect: defenseEffect.name,
                        args: {
                            value: dto.args.undeadDefense,
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
                            value: dto.args.notUndeadDefense,
                        },
                    },
                });
            }
            await this.combatQueueService.push({
                ctx,
                source,
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Status,
                    statuses: [],
                },
                action: action,
            });
        }                
    }
}
