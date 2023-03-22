import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { distraught } from 'src/game/status/distraught/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { summoned } from 'src/game/status/summoned/constants';

export const yellowSporelingData: Enemy = {
    enemyId: 16,
    name: 'Yellow Sporeling',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Minion,
    size: EnemySizeEnum.Tiny,
    description: 'Minion creature to FungalBrute',
    healthRange: [12, 14],
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
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 2,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                statusName: distraught.name,
                                statusArgs: {
                                    counter: 2,
                                },
                                action: {
                                    name: 'Infect',
                                    hint: 'cast',
                                },
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.4,
                    scriptId: 1,
                },
                {
                    probability: 0.6,
                    scriptId: 2,
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
                            action: {
                                name: 'Attack',
                                hint: 'attack',
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
    ],
};
