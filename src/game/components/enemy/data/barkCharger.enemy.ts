import { resolveStatus } from 'src/game/status/resolve/constants';
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
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';

export const barkChargerData: Enemy = {
    enemyId: 6,
    stage: 1,
    selectable: true,
    isActive: true,
    name: 'BarkCharger',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description: 'Moves on land mostly, to charge at his foes',
    healthRange: [10, 12],
    scripts: [
        {
            id: 0,
            intentions: [],
            next: [
                { probability: 0.5, scriptId: 1 },
                { probability: 0.5, scriptId: 2 },
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
                                name: 'Thrust',
                                hint: 'attack1',
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 2,
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
                    scriptId: 1,
                },
                {
                    probability: 0.5,
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
                                name: 'Brace',
                                hint: 'brace_start',
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 2,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                statusName: resolveStatus.name,
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
                    probability: 0.9,
                    scriptId: 3,
                },
                {
                    probability: 0.1,
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
    ],
};
