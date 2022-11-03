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
import { fatigue } from 'src/game/status/fatigue/constants';
import { StunnedCard } from '../../card/data/stunned.card';
import { addCardEffect } from 'src/game/effects/addCard/contants';

export const mimicFrog1Data: Enemy = {
    enemyId: 8,
    name: 'MimicFrog1',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description: ' ',
    healthRange: [22, 28],
    scripts: [
        {
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
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Stun,
                    target: CardTargetedEnum.Player,
                    value: 2,
                    effects: [
                        {
                            effect: addCardEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 2,
                                cardId: StunnedCard.cardId,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptIndex: 2,
                },
                {
                    probability: 0.5,
                    scriptIndex: 3,
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
                    scriptIndex: 3,
                },
                {
                    probability: 0.4,
                    scriptIndex: 2,
                },
            ],
        },
        {
            intentions: [
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 2,
                    status: [
                        {
                            name: fatigue.name,
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
                    probability: 0.7,
                    scriptIndex: 0,
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
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 13,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 13,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.5,
                    scriptIndex: 0,
                },
                {
                    probability: 0.25,
                    scriptIndex: 1,
                },
                {
                    probability: 0.25,
                    scriptIndex: 2,
                },
            ],
        },
    ],
};
