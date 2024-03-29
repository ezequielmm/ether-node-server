import { addCardEffect } from 'src/game/effects/addCard/contants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { PoisonedCard } from '../../card/data/poisoned.card';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const stingFaeData: Enemy = {
    enemyId: 10,
    stage: 1,
    selectable: true,
    isActive: true,
    name: 'StingFae1',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description: '',
    healthRange: [9, 15],
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
                                name: 'Stab',
                                hint: 'attack1',
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
                    value: 5,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 5,
                            },
                            action: {
                                name: 'Dodge',
                                hint: 'cast1',
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
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    effects: [
                        {
                            effect: addCardEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 1,
                                cardId: PoisonedCard.cardId,
                                destination: 'discard',
                            },
                            action: {
                                name: 'Sting',
                                hint: 'attack2',
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
    ],
};
