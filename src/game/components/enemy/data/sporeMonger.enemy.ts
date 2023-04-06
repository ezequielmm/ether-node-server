import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyCategoryEnum,
    EnemyIntentionType,
    EnemySizeEnum,
    EnemyTypeEnum,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const sporeMongerData: Enemy = {
    enemyId: 1,
    isActive: true,
    name: 'Sporemonger',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description:
        'Floating enemy. Camouflaged, but will flare its foliage "hair" to appear more intimidating. Mouth can spit a toxic slime at enemies.',
    healthRange: [42, 46],
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
                    value: 11,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 11,
                            },
                            action: {
                                name: 'Swipe',
                                hint: 'attack1',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptId: 2,
                },
                {
                    probability: 0.5,
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
                    value: 7,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 7,
                            },
                            action: {
                                name: 'Rattle',
                                hint: 'cast1',
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
                    value: 4,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 4,
                            },
                            action: {
                                name: 'Toxic Spit',
                                hint: 'mouthOpen',
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
                    scriptId: 1,
                },
            ],
        },
    ],
};
