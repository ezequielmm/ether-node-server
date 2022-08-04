import { Injectable } from '@nestjs/common';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectHandler, StatusEffectDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { heraldDelayed } from './constants';

@StatusDecorator({
    status: heraldDelayed,
})
@Injectable()
export class HeraldDelayedStatus implements StatusEffectHandler {
    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const turns = args.status.args.value;
        if (
            args.status.addedInRound + turns <
            args.ctx.expedition.currentNode.data.round
        ) {
            args.remove();
            return args.effectDTO;
        }

        args.effectDTO.args.currentValue *= 2;
        return args.effectDTO;
    }
}
