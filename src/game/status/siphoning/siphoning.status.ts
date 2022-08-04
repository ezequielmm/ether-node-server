import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { siphoning } from './constants';

@StatusDecorator({
    status: siphoning,
})
@Injectable()
export class SiphoningStatus implements StatusEffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
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
            ctx,
            effectDTO: { args, source },
            remove,
        } = dto;

        if (ctx.expedition.currentNode.data.round > dto.status.addedInRound) {
            remove();
            return dto.effectDTO;
        }

        const newDefense = args.currentValue;

        if (PlayerService.isPlayer(source)) {
            const defense = source.value.combatState.defense;

            await this.playerService.setDefense(ctx, defense + newDefense);
        } else if (EnemyService.isEnemy(source)) {
            const defense = source.value.defense;

            await this.enemyService.setDefense(
                ctx,
                source.value.id,
                defense + newDefense,
            );
        }

        return dto.effectDTO;
    }
}
