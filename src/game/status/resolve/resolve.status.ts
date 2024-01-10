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
    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }

    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        
        const effectDTO = dto.effectDTO;

        effectDTO.args.currentValue = effectDTO.args.currentValue + dto.status.args.counter;
        
        return effectDTO;
    }
}
