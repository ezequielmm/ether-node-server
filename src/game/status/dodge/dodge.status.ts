import { Injectable } from '@nestjs/common';
import { EffectDTO } from '../../effects/effects.interface';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { dodge } from './constants';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';

@StatusDecorator({
    status: dodge,
})
@Injectable()
export class DodgeStatus implements StatusEffectHandler {
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
        dto.args.currentValue = 0;
        return dto;
    }
}
