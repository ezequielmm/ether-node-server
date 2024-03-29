import { Injectable } from '@nestjs/common';
import { EffectDTO } from '../../effects/effects.interface';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { dodge } from './constants';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { DamageEnemyArgs } from 'src/game/effects/damage/damageenemy.effect';
import { forceField } from '../forceField/contants';

@StatusDecorator({
    status: dodge,
})
@Injectable()
export class DodgeStatus implements StatusEffectHandler {
    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }


    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        const args = dto.status.args;

        // console.log(":::::BUFF::::")
        // console.log(dto.effectDTO.ctx.expedition.currentNode.data.player.statuses.buff)

        const forcefieldFind = dto.effectDTO.ctx.expedition.currentNode.data.player.statuses.buff.find(x => x.name === forceField.name);

        if (dto.effectDTO.source.type == CardTargetedEnum.Enemy && forcefieldFind) {
            // console.log(":::::::::::ENTRA IF BUFF::::::::::::::::::");

            return dto.effectDTO;

        } else if (dto.effectDTO.source.type == CardTargetedEnum.Player && !forceField) {
            args.counter--;

            this.cancelDamage(dto.effectDTO);

            if (args.counter <= 0) {
                dto.remove();
            } else {
                dto.update(args);
            }

        //     return dto.effectDTO;
        } else if (dto.effectDTO.source.type == CardTargetedEnum.Enemy && !forcefieldFind) {
            args.counter--;

            this.cancelDamage(dto.effectDTO);

            if (args.counter <= 0) {
                dto.remove();
            } else {
                dto.update(args);
            }

            return dto.effectDTO;

        }



    }

    private async cancelDamage(dto: EffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        const tempValue = dto.args.currentValue;
        const tempValueCard = dto.ctx.expedition.currentNode.data.player.cards.discard;
        if (dto.args.useEnergyAsValue) {
            dto.ctx.expedition.currentNode.data.player.energy = 0;
        } else {
            if (dto.source.type == CardTargetedEnum.Enemy || dto.source.type == CardTargetedEnum.Player) {
                // const tempValue = dto.args.currentValue;
                dto.args.currentValue = 0;
                // dto.ctx.expedition.currentNode.data.player.hpCurrent = tempValue;

                // await this.esperarSegundos();

                // dto.args.currentValue = tempValue + 2;

                // dto.ctx.expedition.currentNode.data.player.cards.discard = tempValueCard;
                // console.log("::CURRENT VALUE ACTUAL:::")
                // console.log(dto.args.currentValue);
            }
        }
        return dto;
    }

    async esperarSegundos(): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 150);
        });
    }
}
