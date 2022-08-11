import { Injectable } from '@nestjs/common';
import { set } from 'lodash';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { ExpeditionEntity } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { EffectDTO } from 'src/game/effects/effects.interface';
import {
    JsonStatus,
    StatusEffectDTO,
    StatusEffectHandler,
} from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { confusion } from './constants';

@StatusDecorator({
    status: confusion,
})
@Injectable()
export class ConfusionStatus implements StatusEffectHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
    ) {}

    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return args.effectDTO;
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        const {
            effectDTO: { source, target },
            ctx,
        } = dto;
        const { expedition } = ctx;

        // If the round is over, the status will be removed
        if (expedition.currentNode.data.round > dto.status.addedInRound + 1) {
            dto.remove();
            return dto.effectDTO;
        }

        let newTarget: ExpeditionEntity;

        if (PlayerService.isPlayer(target)) {
            newTarget = this.enemyService.getRandom(ctx);
        } else if (EnemyService.isEnemy(target)) {
            newTarget = this.playerService.get(ctx);
        }

        // Set using lodash to avoid typescript readonly error
        // This change is unique to this status
        set(dto.effectDTO, 'target', newTarget);

        // Confuse statuses
        // NOTE: This is a in memory change, it is not necessary to save the expedition
        this.confuseStatuses(source);

        return dto.effectDTO;
    }

    private confuseStatuses(source: ExpeditionEntity) {
        let statuses: JsonStatus[] = [];
        if (EnemyService.isEnemy(source)) {
            statuses = source.value.currentScript.intentions.flatMap(
                (intention) => intention.status || [],
            );
        } else if (PlayerService.isPlayer(source)) {
            statuses = source.value.combatState.cards.hand.flatMap(
                (card) => card.properties.statuses,
            );
        }

        statuses.forEach((status) => {
            switch (status.args.attachTo) {
                case (CardTargetedEnum.Enemy,
                CardTargetedEnum.RandomEnemy,
                CardTargetedEnum.AllEnemies):
                    status.args.attachTo = CardTargetedEnum.Player;
                    break;

                case CardTargetedEnum.Player:
                    status.args.attachTo = CardTargetedEnum.RandomEnemy;
                    break;
                case CardTargetedEnum.Self:
                    status.args.attachTo =
                        source.type == CardTargetedEnum.Player
                            ? CardTargetedEnum.RandomEnemy
                            : CardTargetedEnum.Player;
                    break;
            }
        });
    }
}
