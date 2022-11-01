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

export const thornWolfData: Enemy = {
    enemyId: 11,
    name: 'ThornWolf',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description:
        'Imposing wolf-cat creature with multiple eyes and sharp thorns. Mutated by the bacteria in the swamp, he is half animal, half plant and an itchy fungal slime grows on him, making him extremely irritable. He claws at knights with his massive toxic THORN CLAWS',
    healthRange: [85, 90],
    scripts: [
        {
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 15,
                    //  This effect 'Summon ' was not developed so I have added 'damageEffect' one
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 15,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptIndex: 2,
                },
                {
                    probability: 0.5,
                    scriptIndex: 3,
                },
            ],
        },
        {
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
                    probability: 0.5,
                    scriptIndex: 2,
                },
                {
                    probability: 0.5,
                    scriptIndex: 3,
                },
            ],
        },
        {
            intentions: [
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 5,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 5,
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 2,
                    //  This effect 'Buff ' was not developed so I have added 'defenseEffect' one
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 2,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptIndex: 0,
                },
                {
                    probability: 0.5,
                    scriptIndex: 1,
                },
            ],
        },
        {
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 5,
                    //  This effect 'Summon ' was not developed so I have added 'defenseEffect' one
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 5,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptIndex: 0,
                },
                {
                    probability: 0.5,
                    scriptIndex: 1,
                },
            ],
        },
    ],
};
