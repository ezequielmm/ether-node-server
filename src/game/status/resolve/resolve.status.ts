import { Injectable } from '@nestjs/common';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { resolveStatus } from './constants';

@StatusDecorator({
    status: resolveStatus,
})
@Injectable()
export class ResolveStatus implements StatusEffectHandler {
    
    async preview(args: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        
        const effectDTO = dto.effectDTO;

        effectDTO.args.currentValue = Math.max(
            effectDTO.args.currentValue + dto.status.args.counter,
            0,
        );

        return effectDTO;
    }
}
