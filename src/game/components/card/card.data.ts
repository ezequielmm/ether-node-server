import { Card } from './card.schema';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
} from './enums';

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
                    current: 5,
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
                    current: 5,
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
                    current: 8,
                },
            },
            statuses: {
                resolve: {
                    base: 1,
                    current: 1,
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
                    current: 4,
                },
                defense: {
                    base: 4,
                    current: 4,
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
                    current: 2,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Keg Chug',
        rarity: CardRarityEnum.Common,
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
                    current: 2,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Parry',
        rarity: CardRarityEnum.Common,
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
                    current: 5,
                },
            },
            statuses: {
                fortitude: {
                    base: 2,
                    current: 2,
                },
            },
        },
    },
    {
        name: 'Bulk Up',
        rarity: CardRarityEnum.Common,
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
                    current: 2,
                },
            },
        },
    },
    {
        name: 'Anticipate',
        rarity: CardRarityEnum.Common,
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
                    current: 8,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Bankhand',
        rarity: CardRarityEnum.Common,
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
                    current: 10,
                },
            },
            statuses: {
                distraught: {
                    base: 1,
                    current: 1,
                },
            },
        },
    },
    {
        name: 'Bluster',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 0,
        description: 'Gain 2 energy. Start next turn with 1 less energy.',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {
                energy: {
                    base: 2,
                    current: 2,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Find Weakness',
        rarity: CardRarityEnum.Uncommon,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 1 damage 1 time. Double these values this combat.',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {
                damage: {
                    base: 1,
                    current: 1,
                },
            },
            statuses: {},
        },
        merchant_info: {
            coin_cost: [68, 82],
        },
    },
    {
        name: 'Lunge',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 4 damage twice. Draw 1 card.',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {
                damage: {
                    base: 4,
                    current: 4,
                },
                drawCard: {
                    base: 1,
                    current: 1,
                },
            },
            statuses: {},
        },
        merchant_info: {
            coin_cost: [45, 55],
        },
    },
    {
        name: 'Turtle',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 0,
        description: 'At the end of this turn, double your defense',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {},
            statuses: {
                turtling: {
                    base: 1,
                    current: 1,
                },
            },
        },
        merchant_info: {
            coin_cost: [45, 55],
        },
    },
    {
        name: 'Enflame',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Power,
        pool: 'knight',
        energy: 2,
        description: 'First Attack each turn will Apply 2 Burn. Exhaust',
        targeted: CardTargetedEnum.Enemy,
        keywords: [CardKeywordEnum.Exhaust],
        properties: {
            effects: {},
            statuses: {
                burn: {
                    base: 2,
                    current: 2,
                },
            },
        },
    },
    {
        name: 'Charge',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 6 damage to all enemies.',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {
                damage: {
                    base: 6,
                    current: 6,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Plant Feet',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Defend,
        pool: 'knight',
        energy: 0,
        description:
            'Gain 2 defense. Doubled each use for the remainder of combat.',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {
                defense: {
                    base: 2,
                    current: 2,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Pray',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description:
            'At the beginning of your next turn gain 1 Resolve and 1 Fortitude.',
        targeted: CardTargetedEnum.Player,
        keywords: [],
        properties: {
            effects: {},
            statuses: {
                resolve: {
                    base: 1,
                    current: 1,
                },
                fortitude: {
                    base: 1,
                    current: 1,
                },
            },
        },
    },
    {
        name: 'Intimidate',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 2,
        description: 'Inflict Confusion',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {},
            statuses: {
                confusion: {
                    base: 1,
                    current: 2,
                },
            },
        },
    },
    {
        name: 'Hit Punch',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 0,
        description:
            'Deal 6 damage. Lower this card’s damage by 1 each use during this combat.',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {
                damage: {
                    base: 6,
                    current: 6,
                },
            },
            statuses: {},
        },
    },
    {
        name: 'Spark',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description: 'Inflict 2 Burn',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {},
            statuses: {
                burn: {
                    base: 2,
                    current: 2,
                },
            },
        },
    },
    {
        name: 'Recover',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Skill,
        pool: 'knight',
        energy: 1,
        description:
            'Draw 2 cards. If an enemy is Confused, they both cost 0 this turn.',
        targeted: CardTargetedEnum.Enemy,
        keywords: [],
        properties: {
            effects: {
                drawCard: {
                    base: 2,
                    current: 2,
                },
            },
            statuses: {},
        },
    },
];
