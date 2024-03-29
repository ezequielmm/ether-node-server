import { addCardEffect } from 'src/game/effects/addCard/contants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { ChokingCard } from '../../card/data/choking.card';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const swampGoblin1Data: Enemy = {
    enemyId: 3,
    stage: 1,
    selectable: true,
    isActive: true,
    name: 'SwampGoblin1',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description:
        'Elderly and hunch-backed, she tries to appear harmless but she is aggressive and has Magic powers. Her MAGIC SPORE STAFF is like a huge wand - it can be used to cover enemies in magic toxic spores and choke them',
    healthRange: [20, 26],
    scripts: [
        {
            id: 0,
            intentions: [],
            next: [
                { scriptId: 1, probability: 0.7 },
                { scriptId: 3, probability: 0.3 },
            ],
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
                            },
                            action: {
                                name: 'Club',
                                hint: 'attack',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.7,
                    scriptId: 1,
                },
                {
                    probability: 0.3,
                    scriptId: 3,
                },
            ],
        },
        {
            id: 2,
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Enemy,
                    value: 10,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 10,
                            },
                            action: {
                                name: 'Gather Shadow',
                                hint: 'cast1',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.3,
                    scriptId: 1,
                },
                {
                    probability: 0.7,
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
                                cardId: ChokingCard.cardId,
                                destination: 'discard',
                            },
                            action: {
                                name: 'Spore Cloud',
                                hint: 'cast2',
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
