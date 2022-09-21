import { resolve } from 'src/game/status/resolve/constants';
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

export const trapelicanData: Enemy = {
    enemyId: 12,
    name: 'Trapelican',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description: ' ',
    healthRange: [26, 30],
    scripts: [
        {
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 7,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 7,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 1,
                    scriptIndex: 2,
                },
            ],
        },
        {
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Self,
                    value: 3,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 4,
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Player,
                    value: 3,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 3,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.6,
                    scriptIndex: 2,
                },
                {
                    probability: 0.4,
                    scriptIndex: 0,
                },
            ],
        },
        {
            intentions: [
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    status: [
                        {
                            name: resolve.name,
                            attachTo: CardTargetedEnum.Player,
                            args: {
                                counter: 1,
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    status: [
                        {
                            name: resolve.name,
                            attachTo: CardTargetedEnum.Self,
                            args: {
                                counter: 1,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.7,
                    scriptIndex: 0,
                },
                {
                    probability: 0.3,
                    scriptIndex: 1,
                },
            ],
        },
    ],
};
