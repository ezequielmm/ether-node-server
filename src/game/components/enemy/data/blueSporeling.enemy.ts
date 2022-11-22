import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const blueSporelingData: Enemy = {
    enemyId: 14,
    name: 'Blue Sporeling',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Minion,
    size: EnemySizeEnum.Tiny,
    description: 'Minion creature to FungalBrute',
    healthRange: [12, 14],
    scripts: [
        {
            id: 1,
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
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
