import { addCardEffect } from 'src/game/effects/addCard/contants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { StunnedCard } from '../../card/data/stunned.card';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const fungalBruteData: Enemy = {
    enemyId: 7,
    name: 'FungalBrute',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Boss,
    size: EnemySizeEnum.Giant,
    description:
        'Massive, stomping fungal organism that stomps the ground, causing an area of damage where the ground shakes around him. Additionally, he can send large toxic spores flying around him and the knights have to dodge them or prepare to be paralyzed and stomped on.',
    healthRange: [140, 140],
    scripts: [
        {
            id: 1,
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 4,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 4,
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
                    scriptId: 2,
                },
                {
                    probability: 0.5,
                    scriptId: 3, // Need to integrate [If Sporelings=0] Script 4: Spawn; [If Sporelings > 0] Script 5: Cultivate
                },
            ],
        },
        {
            id: 2,
            intentions: [
                {
                    type: EnemyIntentionType.Defend,
                    target: CardTargetedEnum.Self,
                    value: 8,
                    effects: [
                        {
                            effect: defenseEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                value: 8,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 1,
                    scriptId: 3,
                },
            ],
        },
        {
            id: 3,
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 28,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 28,
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
                    scriptId: 1, // TEMPORAL REDIRECTION
                },
            ],
        },
    ],
};
