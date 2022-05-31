import { Card } from './card.schema';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from './enums';

export const Cards: Card[] = [
    {
        name: 'Attack',
        rarity: CardRarityEnum.Starter,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 5 Damage',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {
                damage: {
                    base: 5,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Defend',
        rarity: CardRarityEnum.Starter,
        card_type: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'Gain 5 Defense',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {
                defense: {
                    base: 5,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Brace',
        rarity: CardRarityEnum.Starter,
        card_type: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 2,
        description: 'Gain 8 Defense and 1 Resolve',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {
                defense: {
                    base: 8,
                },
            },
            statuses: {
                resolve: {
                    base: 1,
                },
            },
        },
    },
    {
        name: 'Counter',
        rarity: CardRarityEnum.Starter,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 4 Damage, Gain 4 Defense',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {
                damage: {
                    base: 4,
                },
                defense: {
                    base: 4,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'First Move',
        rarity: CardRarityEnum.Starter,
        card_type: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Gain 2 Energy',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {
                energy: {
                    base: 2,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Keg Chug',
        rarity: CardRarityEnum.Commom,
        card_type: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Draw 2 cards',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {
                energy: {
                    base: 2,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Parry',
        rarity: CardRarityEnum.Commom,
        card_type: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 1,
        description: 'Gain 5 Defense, Gain 2 Fortitude',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {
                defense: {
                    base: 5,
                },
            },
            statuses: {
                fortitude: {
                    base: 2,
                },
            },
        },
    },
    {
        name: 'Bulk Up',
        rarity: CardRarityEnum.Commom,
        card_type: CardTypeEnum.Power,
        pool: 'knight',
        energy: 2,
        description: 'Gain 2 Resolve',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {},
            statuses: {
                resolve: {
                    base: 2,
                },
            },
        },
    },
    {
        name: 'Anticipate',
        rarity: CardRarityEnum.Commom,
        card_type: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 2,
        description: 'Gain 8 Defense. Defense carries over to next turn.',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {
                defense: {
                    base: 8,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Bankhand',
        rarity: CardRarityEnum.Commom,
        card_type: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 2,
        description: 'Deal 10 damage. Inflict 1 Distraught.',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {
                damage: {
                    base: 10,
                },
            },
            statuses: {
                distraught: {
                    base: 1,
                },
            },
        },
    },
];
