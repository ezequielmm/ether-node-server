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
import { AttachedStatus } from 'src/game/status/interfaces';

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
        private readonly combatQueueService: CombatQueueService
    ) {}

    async handle(dto: EffectDTO<HolyEffectsArgs>): Promise<void> {
        console.log("Holy Explosion handle method executed--------")
        const { ctx } = dto;
        const energy = ctx.expedition.currentNode.data.player.energy
        await this.holyExplosion(dto, energy);
    }

    protected async holyExplosion(dto: EffectDTO<HolyEffectsArgs>, energy: number) {
        const { ctx, source, target, action } = dto;

        //we get the alive enemies in the currentNode
        //const currentNodeEnemies = this.enemyService.getLiving(ctx);

        if (!target) {
            this.logger.debug(ctx.info, 'No target found for holyExplosion');
            return;
        }  

       // for(let currentEnemy of currentNodeEnemies){
        if(EnemyService.isEnemy(target)){

            const enemyType = target.value.type;

            const existingBurnIndex = target.value.statuses.debuff.findIndex(debuff => debuff.name === burn.name);
            
            if (existingBurnIndex !== -1) {
                target.value.statuses.debuff[existingBurnIndex].args.counter += enemyType === EnemyTypeEnum.Undead ? dto.args.undeadBurn : dto.args.notUndeadBurn;
            } else {
                const newBurn:AttachedStatus = { 
                    name: burn.name, 
                    addedInRound: ctx.expedition.currentNode.data.round, 
                    sourceReference: this.statusService.getReferenceFromEntity(target),
                    args: {counter: enemyType === EnemyTypeEnum.Undead ? dto.args.undeadBurn : dto.args.notUndeadBurn,} };
                target.value.statuses.debuff.push(newBurn);
            }

            await this.statusService.updateEnemyStatuses(ctx.expedition, target, target.value.statuses);

            await this.combatQueueService.push({
                ctx,
                source,
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Status,
                    statuses: [{name: burn.name, counter: 3, description: ""}],
                },
                action: action,
            });

            // await this.statusService.attach({
            //     ctx,
            //     source,
            //     target,
            //     statusName: burn.name,
            //     statusArgs: {counter: (enemyType === EnemyTypeEnum.Undead ? dto.args.undeadBurn : dto.args.notUndeadBurn)},
            //     action: action,
            // });

            await this.effectService.apply({
                ctx,
                source,
                target,
                effect: {
                    effect: damageEffect.name,
                    args: {
                        value: (enemyType === EnemyTypeEnum.Undead ? dto.args.undeadDamage + energy : dto.args.notUndeadDamage),
                    },
                },
            });
        }             
    } 
}
