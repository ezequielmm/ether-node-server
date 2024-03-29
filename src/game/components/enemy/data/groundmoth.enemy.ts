import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const groundMothData: Enemy = {
    enemyId: 2,
    stage: 1,
    selectable: true,
    isActive: true,
    name: 'GroundMoth',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description:
        'Medium sized - maybe with his back slightly above a human. His tiny face is actually fake and a lure to make him seem kinda harmless despite his size',
    healthRange: [48, 56],
    scripts: [
        {
            id: 0,
            intentions: [],
            next: [
                { scriptId: 1, probability: 0.5 },
                { scriptId: 2, probability: 0.5 },
            ],
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
                                name: 'Claw',
                                hint: 'attack1',
                            },
                        },
                    ],
                },
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
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 6,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 6,
                            },
                            action: {
                                name: 'Rumble',
                                hint: 'cast1',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.75,
                    scriptId: 3,
                },
                {
                    probability: 0.25,
                    scriptId: 1,
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
                            action: {
                                name: 'Proboscis',
                                hint: 'attack2',
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 5,
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
                    probability: 1,
                    scriptId: 1,
                },
            ],
        },
    ],
};
