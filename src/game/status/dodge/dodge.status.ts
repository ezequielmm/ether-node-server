import { Injectable } from '@nestjs/common';
import { EffectDTO } from '../../effects/effects.interface';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { dodge } from './constants';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { DamageEnemyArgs } from 'src/game/effects/damage/damageenemy.effect';
import { PlayerService } from 'src/game/components/player/player.service';

@StatusDecorator({
    status: dodge,
})
@Injectable()
export class DodgeStatus implements StatusEffectHandler {
    private readonly playerService: PlayerService

    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.cancelDamage(args.effectDTO);
    }

    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        const args = dto.status.args;


        if(dto.effectDTO.source.type == CardTargetedEnum.Enemy){
            args.counter--;
        }else if(dto.effectDTO.source.type == CardTargetedEnum.Player){
            args.counter--;
        }
        
        this.cancelDamage(dto.effectDTO);

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
            // dto.args.currentValue = 0;
            // const originalHP = dto.ctx.expedition.currentNode.data.player.hpCurrent;
            // console.log("::::::::::::CURRENT HP:::::::::::::::")
            // console.log(originalHP);
            if(dto.ctx.expedition.currentNode.data.enemies.every(x => x.currentScript.intentions.every(a => a.name == "attack")))
                dto.ctx.expedition.currentNode.data.enemies.every(x => x.currentScript.intentions.every(a => a.value == 0));
            // dto.args.currentValue = dto.ctx.expedition.currentNode.data.player.hpCurrent + originalAttack;

        }
        return dto;
    }
}
