import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { fatigue } from 'src/game/status/fatigue/constants';
import { StunnedCard } from '../../card/data/stunned.card';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';

export const mimicFrog1Data: Enemy = {
    enemyId: 8,
    name: 'MimicFrog1',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description: ' ',
    healthRange: [22, 28],
    scripts: [
        {
            id: 0,
            intentions: [],
            next: [
                { probability: 0.7, scriptId: 1 },
                { probability: 0.3, scriptId: 2 },
            ],
        },
        {
            id: 1,
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 11,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 11,
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 2,
                    effects: [
                        {
                            effect: addCardEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 2,
                                cardId: StunnedCard.cardId,
                                destination: 'draw',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptId: 3,
                },
                {
                    probability: 0.5,
                    scriptId: 4,
                },
            ],
        },
        {
            id: 2,
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 6,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 6,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.6,
                    scriptId: 4,
                },
                {
                    probability: 0.4,
                    scriptId: 3,
                },
            ],
        },
        {
            id: 3,
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
                                statusName: fatigue.name,
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
                    probability: 0.7,
                    scriptId: 1,
                },
                {
                    probability: 0.3,
                    scriptId: 2,
                },
            ],
        },
        {
            id: 4,
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 13,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 13,
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
                    probability: 0.25,
                    scriptId: 2,
                },
                {
                    probability: 0.25,
                    scriptId: 3,
                },
            ],
        },
    ],
};
