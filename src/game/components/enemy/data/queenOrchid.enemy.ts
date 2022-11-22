import { addCardEffect } from 'src/game/effects/addCard/contants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { ChokingCard } from '../../card/data/choking.card';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const queenOrchidData: Enemy = {
    enemyId: 9,
    name: 'QueenOrchid',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description:
        'The sexy siren of the mossy dark forest. Impossible to resist! But as soon as you get close, you realize she is just a kind of "doll" and you are about to get wrapped in leafy tendrils and into the huge gaping maw of... the ORCHID QUEEN!',
    healthRange: [70, 75],
    scripts: [
        {
            id: 1,
            intentions: [
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    effects: [
                        {
                            effect: addCardEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 1,
                                cardId: ChokingCard.cardId, //
                                destination: 'draw',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 1,
                    scriptId: 2,
                },
            ],
        },
        {
            id: 2,
            intentions: [
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 2,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                statusName: feebleStatus.name,
                                statusArgs: {
                                    counter: 2,
                                },
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 1,
                    scriptId: 3,
                },
            ],
        },
        {
            id: 3,
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 10,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 10,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptId: 1,
                },
                {
                    probability: 0.5,
                    scriptId: 2,
                },
            ],
        },
    ],
};
