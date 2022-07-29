import { Injectable } from '@nestjs/common';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { Context } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
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
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly playerService: PlayerService,
    ) {}

    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return args.effectDTO;
    }

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const {
            expedition,
            effectDTO: { args, source, client },
            remove,
        } = dto;
        const ctx: Context = {
            client,
            expedition: expedition as ExpeditionDocument,
        };

        if (dto.expedition.currentNode.data.round > dto.status.addedInRound) {
            remove();
            return dto.effectDTO;
        }

        const newDefense = args.currentValue;

        if (EffectService.isPlayer(source)) {
            const defense = source.value.combatState.defense;

            await this.playerService.setDefense(ctx, defense + newDefense);
        } else if (EffectService.isEnemy(source)) {
            const defense = source.value.defense;

            await this.expeditionService.setEnemyDefense(
                client.id,
                source.value.id,
                newDefense + defense,
            );
        }

        return dto.effectDTO;
    }
}
