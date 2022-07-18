import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
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
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(dto: StatusEffectDTO<HealArgs>): Promise<EffectDTO<HealArgs>> {
        const {
            remove,
            expedition: {
                playerState: { hpCurrent, hpMax },
            },
            effectDTO: {
                args: { value: hpToApply },
            },
            client,
        } = dto;

        if (dto.expedition.currentNode.data.round > dto.status.addedInRound) {
            remove();
            return dto.effectDTO;
        }

        const newHpCurrent = Math.min(hpMax, hpCurrent + hpToApply);

        this.expeditionService.setPlayerHealth({
            clientId: client.id,
            hpCurrent: newHpCurrent,
        });

        return dto.effectDTO;
    }
}
