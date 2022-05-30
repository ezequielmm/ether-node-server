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
];
