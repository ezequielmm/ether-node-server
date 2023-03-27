import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { blightedStatus } from 'src/game/status/blighted/constants';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';

export const deepSorcererData: Enemy = {
    enemyId: 22,
    name: 'Deep Sorcerer',
    type: EnemyTypeEnum.Human,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Medium,
    description:
        'Human figure, stooped over and withered by mutation. Creepy movement. Carries a burning torch. Mossy tendrils will writhe and pulse gently.',
    healthRange: [125, 130],
    scripts: [
        {
            id: 0,
            intentions: [],
            next: [{ probability: 1, scriptId: 1 }],
        },
        {
            id: 1,
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 5,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 5,
                            },
                            action: {
                                name: 'Strike',
                                hint: 'attack1_strike',
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 7,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 7,
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
                    value: 18,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 18,
                            },
                            action: {
                                name: 'Blast',
                                hint: 'attack2_blast',
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
            id: 3,
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                statusName: blightedStatus.name,
                                statusArgs: {
                                    counter: 1,
                                },
                                action: {
                                    name: 'Blight',
                                    hint: 'cast1_blight',
                                },
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
                    probability: 0.4,
                    scriptId: 2,
                },
            ],
        },
        {
            id: 4,
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
                                action: {
                                    name: 'Sap',
                                    hint: 'cast2_Sap',
                                },
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 3,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                statusName: resolveStatus.name,
                                statusArgs: {
                                    counter: 3,
                                },
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
