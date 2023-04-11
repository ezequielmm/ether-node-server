import { addCardEffect } from 'src/game/effects/addCard/contants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { MossCard } from '../../card/data/moss.card';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const stickMantisData: Enemy = {
    enemyId: 20,
    isActive: false,
    name: 'Stick Mantis',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description:
        'Long skinny insect shaped like a worm. Carries a large growth of mutant moss on its abdomen.',
    healthRange: [25, 30],
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
                    value: 4,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 4,
                                multiplier: 2,
                            },
                            action: {
                                name: 'Stab',
                                hint: 'attack1_stab',
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
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    effects: [
                        {
                            effect: addCardEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 1,
                                cardId: MossCard.cardId,
                                destination: 'discard',
                            },
                            action: {
                                name: 'Fling Moss',
                                hint: 'cast1_flingmoss',
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
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.RandomEnemy,
                    value: 8,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.RandomEnemy,
                            args: {
                                value: 8,
                            },
                            action: {
                                name: 'Block',
                                hint: 'cast2_block',
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
