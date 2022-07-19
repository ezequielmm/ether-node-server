import { Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { EffectDTO } from 'src/game/effects/effects.interface';
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

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        // Return the damage to the source with the value of the status
        const applyDTO = {
            client: dto.client,
            expedition: dto.expedition,
            source: dto.effectDTO.target,
            target: dto.effectDTO.source,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: dto.status.args.value,
                },
            },
        };

        // Apply damage to the source
        await this.effectService.apply(applyDTO);

        // Don't modify the args, the target will be damaged as well.
        return dto.effectDTO;
    }
}
