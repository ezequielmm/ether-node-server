import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const ancientOneData: Enemy = {
    enemyId: 5,
    name: 'AncientOne',
    type: EnemyTypeEnum.Spirit,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description:
        'Imposing beast, gentle usually... until there are intruders in his forest! His "chestmouth" shows scary teeth for intimidation, he lowers his head and sweeps in front of him with his antlers, like a moose',
    healthRange: [80, 85],
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
                                    name: 'Roar',
                                    hint: 'cast1',
                                },
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.75,
                    scriptId: 2,
                },
                {
                    probability: 0.25,
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
                    value: 22,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 22,
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
                    probability: 0.75,
                    scriptId: 4,
                },
                {
                    probability: 0.25,
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
                    value: 18,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 18,
                            },
                            action: {
                                name: 'Charge',
                                hint: 'attack2',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 1,
                    scriptId: 1,
                },
            ],
        },
        {
            id: 4,
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 18,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 18,
                            },
                            action: {
                                name: 'Fade',
                                hint: 'cast2',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.75,
                    scriptId: 1,
                },
                {
                    probability: 0.25,
                    scriptId: 3,
                },
            ],
        },
    ],
};
