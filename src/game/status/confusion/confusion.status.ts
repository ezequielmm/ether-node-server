import { Injectable } from '@nestjs/common';
import { set } from 'lodash';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import {
    EffectDTO,
    SourceEntityDTO,
    TargetEntityDTO,
} from 'src/game/effects/effects.interface';
import { EffectService } from 'src/game/effects/effects.service';
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
    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return args.effectDTO;
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        // If the round is over, the status will be removed
        if (
            dto.expedition.currentNode.data.round >
            dto.status.addedInRound + 1
        ) {
            dto.remove();
            return dto.effectDTO;
        }

        const {
            effectDTO: { source, target },
            expedition,
        } = dto;

        let newTarget: TargetEntityDTO;

        if (EffectService.isPlayer(target)) {
            newTarget = {
                ...EffectService.extractRandomEnemyDTO(expedition),
                type: CardTargetedEnum.Enemy,
            };
        } else if (EffectService.isEnemy(target)) {
            newTarget = EffectService.extractPlayerDTO(expedition);
        }

        // Set using lodash to avoid typescript readonly error
        // This change is unique to this status
        set(dto.effectDTO, 'target', newTarget);

        // Confuse statuses
        // NOTE: This is a in memory change, it is not necessary to save the expedition
        this.confuseStatuses(source);

        return dto.effectDTO;
    }

    private confuseStatuses(source: SourceEntityDTO) {
        let statuses: JsonStatus[] = [];
        if (EffectService.isEnemy(source)) {
            statuses = source.value.currentScript.intentions.flatMap(
                (intention) => intention.status || [],
            );
        } else if (EffectService.isPlayer(source)) {
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
