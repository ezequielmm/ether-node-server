import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { fleeEffect } from 'src/game/effects/flee/constants';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { summoned } from 'src/game/status/summoned/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyCategoryEnum,
    EnemyIntentionType,
    EnemySizeEnum,
    EnemyTypeEnum,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const thornWolfPupData: Enemy = {
    enemyId: 17,
    name: 'ThornWolfPup',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Minion,
    size: EnemySizeEnum.Medium,
    description: 'Minion creature to ThornWolf',
    healthRange: [30, 35],
    scripts: [
        {
            id: -1,
            intentions: [],
            next: [
                {
                    probability: 1,
                    scriptId: 0,
                },
            ],
        },
        {
            // we need a summoned status
            id: 0,
            intentions: [
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Self,
                    value: 1,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                statusName: summoned.name,
                                statusArgs: {},
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.6,
                    scriptId: 1,
                },
                {
                    probability: 0.4,
                    scriptId: 2,
                },
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
                            args: { value: 7 },
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
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 1,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                statusName: spikesStatus.name,
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
                    probability: 0.5,
                    scriptId: 1,
                },
                {
                    probability: 0.5,
                    scriptId: 3,
                },
            ],
        },
        {
            id: 3,
            intentions: [
                {
                    type: EnemyIntentionType.Special,
                    target: CardTargetedEnum.Self,
                    value: 1,
                    effects: [
                        {
                            effect: fleeEffect.name,
                            target: CardTargetedEnum.Self,
                            args: { value: 1 },
                        },
                    ],
                },
            ],
            next: [],
        },
    ],
};
