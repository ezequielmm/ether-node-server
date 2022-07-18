import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { doubleBurn } from 'src/game/effects/doubleBurn/constants';
import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { energyEffect } from 'src/game/effects/energy/constants';
import { healEffect } from 'src/game/effects/heal/constants';
import { removeDefenseEffect } from 'src/game/effects/removeDefense/constants';
import { burn } from 'src/game/status/burn/constants';
import { dodge } from 'src/game/status/dodge/constants';
import { fortitude } from 'src/game/status/fortitude/constants';
import { heraldDelayed } from 'src/game/status/heraldDelayed/constants';
import { regenerate } from 'src/game/status/regenerate/contants';
import { resolve } from 'src/game/status/resolve/constants';
import { siphoning } from 'src/game/status/siphoning/constants';
import {
    tasteOfBloodBuff,
    tasteOfBloodDebuff,
} from 'src/game/status/tasteOfBlood/constants';
import { turtling } from 'src/game/status/turtling/constants';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 5,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 8,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: true,
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
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 5,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: false,
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
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 8,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: true,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    times: 2,
                    args: {
                        value: 4,
                    },
                },
                {
                    effect: drawCardEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 2,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    times: 2,
                    args: {
                        value: 4,
                    },
                },
                {
                    effect: drawCardEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 2,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: true,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 4,
                    },
                },
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 4,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 7,
                    },
                },
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 7,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: true,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 1,
                    },
                },
                // TODO: Double the values of those numbers for remainder of combat
                // SEE: https://robotseamonster.atlassian.net/wiki/spaces/KOTE/pages/38633485/Card+Find+Weakness
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 1,
                    },
                },
                // TODO: Double the values of those numbers for remainder of combat
                // SEE: https://robotseamonster.atlassian.net/wiki/spaces/KOTE/pages/38633485/Card+Find+Weakness
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: true,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.AllEnemies,
                    args: {
                        value: 6,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.AllEnemies,
                    args: {
                        value: 9,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: true,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 0, // Value is calculated in the effect
                        useDefense: true,
                        multiplier: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 0, // Value is calculated in the effect
                        useDefense: true,
                        multiplier: 2,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: true,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 6,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 9,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: true,
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
                    effect: damageEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 5,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: true,
        isUpgraded: false,
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
                    name: turtling.name,
                    args: {
                        value: 1,
                        attachTo: CardTargetedEnum.Player,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: false,
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
                    effect: healEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 2,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: false,
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
                    effect: healEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 4,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: true,
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
                    effect: energyEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 2,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: false,
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
                    effect: energyEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 2,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: true,
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
                    name: resolve.name,
                    args: {
                        value: 1,
                        attachTo: CardTargetedEnum.Player,
                    },
                },
                {
                    name: fortitude.name,
                    args: {
                        value: 1,
                        attachTo: CardTargetedEnum.Player,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: false,
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
                    effect: removeDefenseEffect.name,
                    target: CardTargetedEnum.Enemy,
                    args: {
                        value: 0,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: false,
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
                    effect: removeDefenseEffect.name,
                    target: CardTargetedEnum.AllEnemies,
                    args: {
                        value: 0,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: true,
    },
    {
        cardId: 95,
        name: 'Herald of Pain',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Double all damage dealt next turn.',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: heraldDelayed.name,
                    args: {
                        value: 1,
                        attachTo: CardTargetedEnum.Player,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: false,
    },
    {
        cardId: 96,
        name: 'Herald of Pain+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 0,
        description: 'Double all damage dealt next turn.',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: heraldDelayed.name,
                    args: {
                        value: 1,
                        attachTo: CardTargetedEnum.Player,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: true,
    },
    {
        cardId: 105,
        name: 'Taste of Blood',
        rarity: CardRarityEnum.Rare,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 0,
        description:
            'Take double damage and deal double damage for the next 2 turns.',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: tasteOfBloodBuff.name,
                    args: {
                        value: 1,
                        attachTo: CardTargetedEnum.Player,
                    },
                },
                {
                    name: tasteOfBloodDebuff.name,
                    args: {
                        value: 1,
                        attachTo: CardTargetedEnum.Player,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: false,
    },
    {
        cardId: 101,
        name: 'Quick to Adapt',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'Gain 4 defense for each enemy.',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 4,
                        useEnemies: true,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: false,
    },
    {
        cardId: 102,
        name: 'Quick to Adapt+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'Gain 6 defense for each enemy.',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 6,
                        useEnemies: true,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: true,
    },
    {
        cardId: 91,
        name: 'Kindle',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Apply 1 Burn\nDouble any Burn on all enemies',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: doubleBurn.name,
                    target: CardTargetedEnum.AllEnemies,
                    args: {
                        value: 1,
                    },
                },
            ],
            statuses: [
                {
                    name: burn.name,
                    args: {
                        attachTo: CardTargetedEnum.Enemy,
                        value: 1,
                    },
                },
            ],
        },
        showPointer: true,
        isUpgraded: false,
    },
    {
        cardId: 92,
        name: 'Kindle+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Apply 2 Burn\nDouble any Burn on all enemies',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: doubleBurn.name,
                    target: CardTargetedEnum.AllEnemies,
                    args: {
                        value: 1,
                    },
                },
            ],
            statuses: [
                {
                    name: burn.name,
                    args: {
                        attachTo: CardTargetedEnum.Enemy,
                        value: 2,
                    },
                },
            ],
        },
        showPointer: true,
        isUpgraded: false,
    },
    {
        cardId: 131,
        name: 'Shake it Off',
        rarity: CardRarityEnum.Rare,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description:
            'Gain defense equal to the number of cards in your discard pile.',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 0,
                        useDiscardPileAsValue: true,
                        multiplier: 1,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: false,
    },
    {
        cardId: 132,
        name: 'Shake it Off+',
        rarity: CardRarityEnum.Rare,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description:
            'Gain defense equal to twice the number of cards in your discard pile.',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 0,
                        useDiscardPileAsValue: true,
                        multiplier: 2,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: true,
    },
    {
        cardId: 41,
        name: 'Fade',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 2,
        description: 'Dodge the next attack',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: dodge.name,
                    args: {
                        value: 1,
                        attachTo: CardTargetedEnum.Player,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: false,
    },
    {
        cardId: 129,
        name: 'Give no Ground',
        rarity: CardRarityEnum.Rare,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'Gain 6 defense for each enemy planning to attack.',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 6,
                        useAttackingEnemies: true,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: false,
    },
    {
        cardId: 130,
        name: 'Give no Ground+',
        rarity: CardRarityEnum.Rare,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'Gain 9 defense for each enemy planning to attack.',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: defenseEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 9,
                        useAttackingEnemies: true,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: true,
    },
    {
        cardId: 159,
        name: 'Perfect Timing',
        rarity: CardRarityEnum.Legendary,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'If the enemy intends to attack. Draw 2 defense cards',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: drawCardEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 2,
                        useAttackingEnemies: true,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: false,
    },
    {
        cardId: 160,
        name: 'Perfect Timing+',
        rarity: CardRarityEnum.Legendary,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'If the enemy intends to attack. Draw 3 defense cards',
        keywords: [],
        properties: {
            effects: [
                {
                    effect: drawCardEffect.name,
                    target: CardTargetedEnum.Player,
                    args: {
                        value: 3,
                        useAttackingEnemies: true,
                    },
                },
            ],
            statuses: [],
        },
        showPointer: false,
        isUpgraded: true,
    },
    {
        cardId: 77,
        name: 'Siphon',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description:
            'For the rest of this turn, gain defense equal to damage dealt.',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: siphoning.name,
                    args: {
                        attachTo: CardTargetedEnum.Player,
                        value: 1,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: false,
    },
    {
        cardId: 78,
        name: 'Siphon+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 0,
        description:
            'For the rest of this turn, gain defense equal to damage dealt.',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: siphoning.name,
                    args: {
                        attachTo: CardTargetedEnum.Player,
                        value: 1,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: true,
    },
    {
        cardId: 79,
        name: 'Invoke Blessing',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Power,
        pool: 'knight',
        energy: 1,
        description: 'Gain 1 Regenerate',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: regenerate.name,
                    args: {
                        attachTo: CardTargetedEnum.Player,
                        value: 1,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: true,
    },
    {
        cardId: 80,
        name: 'Invoke Blessing+',
        rarity: CardRarityEnum.Common,
        cardType: CardTypeEnum.Power,
        pool: 'knight',
        energy: 0,
        description: 'Gain 1 Regenerate',
        keywords: [],
        properties: {
            effects: [],
            statuses: [
                {
                    name: regenerate.name,
                    args: {
                        attachTo: CardTargetedEnum.Player,
                        value: 1,
                    },
                },
            ],
        },
        showPointer: false,
        isUpgraded: false,
    },
];
