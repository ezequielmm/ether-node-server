import { EffectName } from 'src/game/effects/effects.enum';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from './card.enum';
import { Card } from './card.schema';

export const Cards: Card[] = [
    {
        cardId: 1,
        name: 'Attack',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 5 Damage',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 5,
                        calculatedValue: 5,
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
    },
    {
        cardId: 2,
        name: 'Attack+',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 8 Damage',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 8,
                        calculatedValue: 8,
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
    },
    {
        cardId: 13,
        name: 'Lunge',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 4 damage twice.\nDraw 1 card',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 4,
                        calculatedValue: 4,
                        targeted: CardTargetedEnum.Enemy,
                        times: 2,
                    },
                },
                // TODO: Draw effect (1)
            ],
            statuses: [],
        },
    },
    {
        cardId: 14,
        name: 'Lunge+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 4 damage twice.\nDraw 2 cards',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 4,
                        calculatedValue: 4,
                        targeted: CardTargetedEnum.Enemy,
                        times: 2,
                    },
                },
                // TODO: Draw effect (2)
            ],
            statuses: [],
        },
    },
    {
        cardId: 7,
        name: 'Counter',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 4 Damage, Gain 4 Defense',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 4,
                        calculatedValue: 4,
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
                // TODO: Defense effect (4)
            ],
            statuses: [],
        },
    },
    {
        cardId: 8,
        name: 'Counter+',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 7 Damage, Gain 7 Defense',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 7,
                        calculatedValue: 7,
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
                // TODO: Defense effect (7)
            ],
            statuses: [],
        },
    },

    {
        cardId: 11,
        name: 'Find Weakness',
        rarity: CardRarityEnum.Uncommon,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 1 damage 1 time. Double these values this combat.',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 1,
                        calculatedValue: 1,
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
                // TODO: Double the values of those numbers for remainder of combat
                // SEE: https://robotseamonster.atlassian.net/wiki/spaces/KOTE/pages/38633485/Card+Find+Weakness
            ],
            statuses: [],
        },
    },
    {
        cardId: 12,
        name: 'Find Weakness+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 1 damage 1 time. Double these values this combat.',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 1,
                        calculatedValue: 1,
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
                // TODO: Double the values of those numbers for remainder of combat
                // SEE: https://robotseamonster.atlassian.net/wiki/spaces/KOTE/pages/38633485/Card+Find+Weakness
            ],
            statuses: [],
        },
    },
    {
        cardId: 19,
        name: 'Charge',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 6 damage to all enemies.',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 6,
                        calculatedValue: 6,
                        targeted: CardTargetedEnum.AllEnemies,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
    },
    {
        cardId: 20,
        name: 'Charge+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 9 damage to all enemies.',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 9,
                        calculatedValue: 9,
                        targeted: CardTargetedEnum.AllEnemies,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
    },

    {
        cardId: 29,
        name: 'Shield Bash',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal damage equal to your Defense.',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 0, // Value is calculated in the effect
                        calculatedValue: 0, // Value is calculated in the effect
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
    },
    {
        cardId: 30,
        name: 'Shield Bash+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal damage equal to 2x your Defense.',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 0, // Value is calculated in the effect
                        calculatedValue: 0, // Value is calculated in the effect
                        targeted: CardTargetedEnum.Enemy,
                        times: 2,
                    },
                },
            ],
            statuses: [],
        },
    },
    {
        cardId: 31,
        name: 'Hilt Punch',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 0,
        description:
            'Deal 6 damage. Lower this card’s damage by 1 each use during this combat.',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 6,
                        calculatedValue: 6, // TODO: Calculate this value based in the count of uses
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
    },
    {
        cardId: 32,
        name: 'Hilt Punch+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 0,
        description:
            'Deal 9 damage. Lower this card’s damage by 1 each use during this combat.',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 9,
                        calculatedValue: 9, // TODO: Calculate this value based in the count of uses
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
    },
];
