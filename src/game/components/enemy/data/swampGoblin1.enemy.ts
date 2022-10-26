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
    name: 'SwampGoblin1',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description:
        'Elderly and hunch-backed, she tries to appear harmless but she is aggressive and has Magic powers. Her MAGIC SPORE STAFF is like a huge wand - it can be used to cover enemies in magic toxic spores and choke them',
    healthRange: [34, 40],
    scripts: [
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
                    probability: 0.7,
                    scriptIndex: 1,
                },
                {
                    probability: 0.3,
                    scriptIndex: 3,
                },
            ],
        },
        {
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
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.7,
                    scriptIndex: 3,
                },
                {
                    probability: 0.3,
                    scriptIndex: 1,
                },
            ],
        },
        {
            intentions: [
                {
                    type: EnemyIntentionType.Stun,
                    target: CardTargetedEnum.Player,
                    value: 1,
                    effects: [
                        {
                            effect: addCardEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 1,
                                cardId: ChokingCard.cardId,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 1,
                    scriptIndex: 1,
                },
            ],
        },
    ],
};
