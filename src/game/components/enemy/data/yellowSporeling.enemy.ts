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
            intentions: [
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 2,
                    status: [
                        {
                            name: distraught.name,
                            attachTo: CardTargetedEnum.Player,
                            args: {
                                counter: 2,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.4,
                    scriptIndex: 0,
                },
                {
                    probability: 0.6,
                    scriptIndex: 1,
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
            ],
            next: [
                {
                    probability: 0.6,
                    scriptIndex: 0,
                },
                {
                    probability: 0.4,
                    scriptIndex: 1,
                },
            ],
        },
    ],
};
