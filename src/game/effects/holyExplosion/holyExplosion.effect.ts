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
import { StatusService } from 'src/game/status/status.service';
import { burn } from 'src/game/status/burn/constants';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';

export interface HolyEffectsArgs {
    undeadDamage: number,
    notUndeadDamage: number,
    undeadBurn: number,
    notUndeadBurn: number,
}
@EffectDecorator({
    effect: holyExplosion,
})
export class holyExplosionEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(holyExplosion.name);
    constructor(
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService,

    ) {}

    async handle(dto: EffectDTO<HolyEffectsArgs>): Promise<void> {
        const { ctx } = dto;
        const energy = ctx.expedition.currentNode.data.player.energy
        await this.holyExplosion(dto, energy);
    }

    protected async holyExplosion(dto: EffectDTO<HolyEffectsArgs>, energy: number) {
        const { ctx, source, target, action } = dto;

        //we get the alive enemies in the currentNode
        const currentNodeEnemies = this.enemyService.getLiving(ctx);
        console.log('ENEMIGOS VIVOS ME RETORNA -> [ ' , currentNodeEnemies, ' ]' );

        if (!target) {
            this.logger.debug(ctx.info, 'No target found for holyExplosion');
            return;
        }

        console.log('ENERGIA', energy);

        //we iterate all enemies
        //currentNodeEnemies.forEach(async(currentEnemy) =>{
            
            if(EnemyService.isEnemy(target)){

                const enemyType = target.value.type;

                //depending if is undead or not, we apply the damageEffect
                if(enemyType === EnemyTypeEnum.Undead){

                    console.log(enemyType, 'ENTRE AL IF');

                    await this.effectService.apply({
                        ctx,
                        source,
                        target,
                        effect: {
                            effect: damageEffect.name,
                            args: {
                                value: dto.args.undeadDamage + energy,
                            },
                        },
                    });

                    console.log(dto.args.undeadDamage + energy);

                    await this.statusService.attach({
                        ctx,
                        source,
                        target,
                        statusName: burn.name,
                        statusArgs: {counter: dto.args.undeadBurn},
                        action: action,
                    });

                    await this.combatQueueService.push({
                        ctx,
                        source,
                        target,
                        args: {
                            effectType: CombatQueueTargetEffectTypeEnum.Status,
                            statuses: [{
                                name: burn.name,
                                counter: dto.args.undeadBurn,
                                description: ''
                            }],
                        },
                        action: action,
                    });

                    console.log(dto.args.undeadBurn);
                }
                else{  
                    console.log(enemyType, 'ENTRE AL ELSE');

                    await this.effectService.apply({
                        ctx,
                        source,
                        target,
                        effect: {
                            effect: damageEffect.name,
                            args: {
                                value: dto.args.notUndeadDamage + energy,
                            },
                        },
                    });

                    console.log(dto.args.notUndeadDamage + energy);

                    await this.statusService.attach({
                        ctx,
                        source,
                        target,
                        statusName: burn.name,
                        statusArgs: {counter: dto.args.notUndeadBurn},
                        action: action,
                    });

                    await this.combatQueueService.push({
                        ctx,
                        source,
                        target,
                        args: {
                            effectType: CombatQueueTargetEffectTypeEnum.Status,
                            statuses: [{
                                name: burn.name,
                                counter: dto.args.notUndeadBurn,
                                description: ''
                            }],
                        },
                        action: action,
                    });
                    
                    console.log(dto.args.notUndeadBurn);
                }
            }       
        //});              
    } 
}
