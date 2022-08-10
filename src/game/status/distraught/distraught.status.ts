import { Injectable } from '@nestjs/common';
import {
    StatusEffectDTO,
    StatusEffectHandler,
} from 'src/game/status/interfaces';
import { StatusDecorator } from 'src/game/status/status.decorator';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { distraught } from './constants';

@StatusDecorator({
    status: distraught,
})
@Injectable()
export class DistraughtStatus implements StatusEffectHandler {
    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<Record<string, any>>> {
        return this.handle(args);
    }

    async handle(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        args.effectDTO.args.currentValue = Math.floor(
            1.5 * args.effectDTO.args.currentValue,
        );
        return args.effectDTO;
    }
}
