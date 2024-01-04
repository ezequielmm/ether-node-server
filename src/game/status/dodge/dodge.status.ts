import { Injectable } from '@nestjs/common';
import { EffectDTO } from '../../effects/effects.interface';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { dodge } from './constants';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { DamageEnemyArgs } from 'src/game/effects/damage/damageenemy.effect';
import { PlayerService } from 'src/game/components/player/player.service';
import { damageEffect } from 'src/game/effects/damage/constants';

@StatusDecorator({
    status: dodge,
})
@Injectable()
export class DodgeStatus implements StatusEffectHandler {
    private readonly playerService: PlayerService

    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        const args = dto.status.args;


        if(dto.effectDTO.source.type == CardTargetedEnum.Enemy){
            args.counter--;
        }else if(dto.effectDTO.source.type == CardTargetedEnum.Player){
            args.counter--;
        }
        
        let tempValue;

        tempValue = dto.effectDTO.args.currentValue;

        this.cancelDamage(dto.effectDTO);

        await this.esperarSegundos();

        dto.effectDTO.args.currentValue = tempValue;

        if (args.counter <= 0) {
            dto.remove();
        } else {
            dto.update(args);
        }

        return dto.effectDTO;
    }

    private cancelDamage(dto: EffectDTO<DamageArgs>): EffectDTO<DamageArgs> {

        if(dto.args.useEnergyAsValue){
            dto.ctx.expedition.currentNode.data.player.energy = 0;
        }else{
            // let tempValue;

            // tempValue = dto.args.currentValue;
            
            dto.args.currentValue = 0;

            

            // {${damageEffect.name}}

            // const originalHP = dto.ctx.expedition.currentNode.data.player.hpCurrent;
            // console.log("::::::::::::CURRENT HP:::::::::::::::")
            // console.log(originalHP);
            // if(dto.ctx.expedition.currentNode.data.enemies.some(x => x.currentScript.intentions.find(a => a.type == "attack"))){
            // dto.ctx.expedition.currentNode.data.enemies.forEach(enemy => {
            //     enemy.currentScript.intentions.forEach(intent => {
            //       if (intent.value != 0) {
            //         // Aquí puedes establecer el valor deseado para las intenciones con valor 0
            //         // Por ejemplo, estableciendo intent.value en otro valor
            //         console.log("::::::::::INTENT ATTACK VALUE::::::::::");
            //         console.log(intent.value);
            //         intent.value = 0; // Cambiando el valor a 10
            //         console.log("::::::::::INTENT ATTACK VALUE 2::::::::::");
            //         console.log(intent.value);
            //       }
            //     });
            //   });
            // }
            // dto.args.currentValue = dto.ctx.expedition.currentNode.data.player.hpCurrent + originalAttack;

        }
        return dto;
    }

    async esperarSegundos(): Promise<void> {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 5000); // 2000 milisegundos = 2 segundos
        });
      }
}
