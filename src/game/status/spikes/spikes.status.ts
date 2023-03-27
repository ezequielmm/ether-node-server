import { Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { ApplyDTO, EffectDTO } from 'src/game/effects/effects.interface';
import { EffectService } from 'src/game/effects/effects.service';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { spikesStatus } from './constants';

@StatusDecorator({
    status: spikesStatus,
})
@Injectable()
export class SpikesStatus implements StatusEffectHandler {
    constructor(private readonly effectService: EffectService) {}

    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return args.effectDTO;
    }

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        // Apply damage to the source
        const {
            ctx,
            effectDTO,
            effectDTO: { target, source },
            status,
        } = dto;

        // Apply damage to the source, if incoming damage is untyped
        if (effectDTO.args.type === undefined) {
            
            // Return the damage to the source with the value of the status
            const applyDTO: ApplyDTO = {
                ctx: ctx,
                source: effectDTO.target,
                target: effectDTO.source,
                effect: {
                    effect: damageEffect.name,
                    args: {
                        value: status.args.counter,
                        type: 'spikes',
                    },
                },
            };

             await this.effectService.apply(applyDTO);
        }

        // Don't modify the args, the target will be damaged as well.
        return effectDTO;
    }
}
