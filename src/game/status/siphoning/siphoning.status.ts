import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { DamageArgs } from 'src/game/effects/damage.effect';
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
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const {
            effectDTO: { args, source, client },
            remove,
        } = dto;

        if (dto.expedition.currentNode.data.round > dto.status.addedInRound) {
            remove();
            return dto.effectDTO;
        }
        const damage = args.currentValue;

        if (EffectService.isPlayer(source)) {
            const defense = source.value.combatState.defense;
            this.expeditionService.setPlayerDefense({
                clientId: client.id,
                value: damage + defense,
            });
        } else if (EffectService.isEnemy(source)) {
            const defense = source.value.defense;
            this.expeditionService.setEnemyDefense(
                client.id,
                source.value.id,
                damage + defense,
            );
        }

        return dto.effectDTO;
    }
}
