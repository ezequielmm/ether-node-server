import { Injectable } from '@nestjs/common';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { HealArgs } from 'src/game/effects/heal.effect';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { regenerate } from './contants';

@StatusDecorator({
    status: regenerate,
})
@Injectable()
export class RegenerateStatus implements StatusEffectHandler {
    async handle(dto: StatusEffectDTO<HealArgs>): Promise<EffectDTO<HealArgs>> {
        const { remove } = dto;

        if (dto.expedition.currentNode.data.round > dto.status.addedInRound) {
            remove();
            return dto.effectDTO;
        }

        return dto.effectDTO;
    }
}
