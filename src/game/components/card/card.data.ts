import { EffectName } from 'src/game/effects/effects.enum';
import { Statuses } from 'src/game/status/contants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardKeywordEnum,
} from './card.enum';
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
        showPointer: true,
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
        showPointer: true,
    },
    {
        cardId: 3,
        name: 'Defend',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'Gain 5 Defense',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Defense,
                    args: {
                        baseValue: 5,
                        calculatedValue: 5,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
    },
    {
        cardId: 4,
        name: 'Defend+',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'Gain 8 Defense',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Defense,
                    args: {
                        baseValue: 8,
                        calculatedValue: 8,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
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
                {
                    name: EffectName.DrawCard,
                    args: {
                        baseValue: 2,
                        calculatedValue: 2,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
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
                {
                    name: EffectName.DrawCard,
                    args: {
                        baseValue: 2,
                        calculatedValue: 2,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
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
                {
                    name: EffectName.Defense,
                    args: {
                        baseValue: 4,
                        calculatedValue: 4,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
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
                {
                    name: EffectName.Defense,
                    args: {
                        baseValue: 7,
                        calculatedValue: 7,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
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
        showPointer: true,
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
        showPointer: true,
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
        showPointer: true,
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
        showPointer: true,
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
        showPointer: true,
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
        showPointer: true,
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
        showPointer: true,
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
        showPointer: true,
    },
    {
        cardId: 57,
        name: 'Fine Edge',
        rarity: CardRarityEnum.Special,
        cardType: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 0,
        description: 'Deal 5 damage. Exhaust',
        keywords: [CardKeywordEnum.Exhaust],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        baseValue: 5,
                        calculatedValue: 5, // TODO: Calculate this value based in the count of uses
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
    },
    {
        cardId: 15,
        name: 'Turtle',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 0,
        description: 'At the end of this turn, double your defense',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: Statuses.Turtling.name,
                    args: {
                        value: 1,
                        targeted: CardTargetedEnum.Player,
                    },
                },
            ],
        },
        showPointer: false,
    },
    {
        cardId: 75,
        name: 'Heaven’s Grace',
        rarity: CardRarityEnum.Rare,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Heal 2 hp',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Heal,
                    args: {
                        baseValue: 2,
                        calculatedValue: 2,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
    },
    {
        cardId: 76,
        name: 'Heaven’s Grace+',
        rarity: CardRarityEnum.Rare,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Heal 4 hp',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Heal,
                    args: {
                        baseValue: 4,
                        calculatedValue: 4,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
    },
    {
        cardId: 9,
        name: 'First Move',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Gain 2 Energy',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Energy,
                    args: {
                        baseValue: 2,
                        calculatedValue: 2,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
    },
    {
        cardId: 10,
        name: 'First Move+',
        rarity: CardRarityEnum.Starter,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 0,
        description: 'Gain 2 Energy',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Energy,
                    args: {
                        baseValue: 2,
                        calculatedValue: 2,
                        targeted: CardTargetedEnum.Player,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
    },
    {
        cardId: 23,
        name: 'Pray',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 0,
        description:
            'At the beginning of your next turn gain 1 [Resolve] and 1 [Fortitude].',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: Statuses.Resolve.name,
                    args: {
                        value: 1,
                        targeted: CardTargetedEnum.Enemy,
                    },
                },
                {
                    name: Statuses.Fortitude.name,
                    args: {
                        value: 1,
                        targeted: CardTargetedEnum.Player,
                    },
                },
            ],
        },
        showPointer: false,
    },
    {
        cardId: 45,
        name: 'Feint',
        rarity: CardRarityEnum.Uncommon,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Remove all Defense from an enemy',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.RemoveDefense,
                    args: {
                        baseValue: 0,
                        calculatedValue: 0,
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
    },
    {
        cardId: 46,
        name: 'Feint+',
        rarity: CardRarityEnum.Uncommon,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 0,
        description: 'Remove all Defense from all enemies',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.RemoveDefense,
                    args: {
                        baseValue: 0,
                        calculatedValue: 0,
                        targeted: CardTargetedEnum.AllEnemies,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
    },
];
