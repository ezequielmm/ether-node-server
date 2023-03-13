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
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { StunnedCard } from '../../card/data/stunned.card';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';

export const treantData: Enemy = {
    enemyId: 13,
    name: 'Treant',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Boss,
    size: EnemySizeEnum.Giant,
    description:
        'An elemental giant with a terrifying giant hand that reaches for knights and CRUSHES them, or claws the ground to send a shockwave of dirt and rocks their way',
    healthRange: [160, 160],
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
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 5,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                statusName: resolveStatus.name,
                                statusArgs: {
                                    counter: 5,
                                },
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
                    scriptId: 5,
                },
            ],
        },
        {
            id: 2,
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
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 5,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                statusName: resolveStatus.name,
                                statusArgs: {
                                    counter: 5,
                                },
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.8,
                    scriptId: 3,
                },
                {
                    probability: 0.2,
                    scriptId: 6,
                },
            ],
        },
        {
            id: 3,
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
                                multiplier: 2,
                            },
                        },
                    ],
                },
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
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.8,
                    scriptId: 4,
                },
                {
                    probability: 0.2,
                    scriptId: 6,
                },
            ],
        },
        {
            id: 4,
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
                                multiplier: 3,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.8,
                    scriptId: 5,
                },
                {
                    probability: 0.2,
                    scriptId: 6,
                },
            ],
        },
        {
            id: 5,
            intentions: [
                {
                    type: EnemyIntentionType.Debuff,
                    target: CardTargetedEnum.Player,
                    value: 3,
                    effects: [
                        {
                            effect: addCardEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 3,
                                cardId: StunnedCard.cardId,
                                destination: 'draw',
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
                    scriptId: 6,
                },
            ],
        },
        {
            id: 6,
            intentions: [
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 1,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                name: spikesStatus.name,
                                statusArgs: {
                                    counter: 1,
                                },
                            },
                        },
                    ],
                },
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 12,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 12,
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
