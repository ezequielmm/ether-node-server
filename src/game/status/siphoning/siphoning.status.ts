import { Injectable } from '@nestjs/common';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { EffectService } from 'src/game/effects/effects.service';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { siphoning } from './constants';

@StatusDecorator({
    status: siphoning,
})
@Injectable()
export class SiphoningStatus implements StatusEffectHandler {
    constructor(private readonly effectService: EffectService) {}

    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return args.effectDTO;
    }

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const {
            ctx,
            effectDTO: { args, source },
            remove,
        } = dto;

        if (ctx.expedition.currentNode.data.round > dto.status.addedInRound) {
            remove();
            return dto.effectDTO;
        }

        // set the amount of defense we are going to get
        const newDefense = args.currentValue;

        // Trigger the effectService and send a defense effect
        await this.effectService.apply({
            ctx,
            source,
            target: source,
            effect: {
                effect: defenseEffect.name,
                args: {
                    value: newDefense,
                },
            },
        });

        return dto.effectDTO;
    }
}
