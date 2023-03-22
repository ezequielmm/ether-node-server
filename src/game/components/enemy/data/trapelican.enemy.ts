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
import { feebleStatus } from 'src/game/status/feeble/constants';
import { trapped } from 'src/game/status/trapped/constants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';

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
            id: 0,
            intentions: [],
            next: [
                { probability: 0.5, scriptId: 3 },
                { probability: 0.5, scriptId: 1 },
            ],
        },
        {
            id: 1,
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
                            action: {
                                name: 'Bite',
                                hint: 'attack1',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.6,
                    scriptId: 2,
                },
                {
                    probability: 0.4,
                    scriptId: 3,
                },
            ],
        },
        {
            id: 2,
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 4,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 4,
                            },
                            action: {
                                name: 'Swoop',
                                hint: 'cast1',
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Attack,
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
                    scriptId: 3,
                },
                {
                    probability: 0.4,
                    scriptId: 1,
                },
            ],
        },
        {
            id: 3,
            intentions: [
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                statusName: feebleStatus.name,
                                statusArgs: {
                                    counter: 1,
                                },
                            },
                            action: {
                                name: 'Lure',
                                hint: 'lure_start',
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                statusName: trapped.name,
                                statusArgs: {
                                    counter: 1,
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
    ],
};
