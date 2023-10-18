import { Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { holyBurn } from './constants';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { EnemyTypeEnum } from 'src/game/components/enemy/enemy.enum';
import { TightenStrapsCard } from 'src/game/components/card/data/tightenStraps.card';

@StatusDecorator({
    status: holyBurn,
})
@Injectable()
export class HolyBurnStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService,
                private readonly enemyService: EnemyService,
    ) {}

    //- It is only executed when the attack of the enemies ends, to add one of burn to those who are burned
    async handle(dto: StatusEventDTO): Promise<void> {
        const unDeadvalue = dto.status.args.counter;
        const notUnDeadValue = 2;
        await this.holyBurn(dto, unDeadvalue, notUnDeadValue);
        dto.status.args.counter++;
        dto.update(dto.status.args);
    }

    protected async holyBurn(dto: StatusEventDTO, unDeadvalue: number, notUnDeadValue: number) {
        const { ctx, source, target } = dto;

        //we get the alive enemies in the currentNode
        const currentNodeEnemies = this.enemyService.getLiving(ctx);

        //we iterate all enemies
        for(let currentEnemy of currentNodeEnemies){

            const enemyType = currentEnemy.value.type;
    
            //depending if is undead or not, we apply the damageEffect
            if(enemyType == EnemyTypeEnum.Undead){
    
                await this.effectService.apply({
                    ctx: ctx,
                    source: source,
                    target: target,
                    effect: {
                        effect: damageEffect.name,
                        args: {
                            value: unDeadvalue,
                            type: 'burn',
                        },
                    },
                });
            }
            else{  
                await this.effectService.apply({
                    ctx: ctx,
                    source: source,
                    target: target,
                    effect: {
                        effect: damageEffect.name,
                        args: {
                            value: notUnDeadValue,
                            type: 'burn',
                        },
                    },
                });
            }
        }                
    }
}
