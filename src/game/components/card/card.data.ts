import { EffectName } from 'src/game/effects/interfaces/baseEffect';
import { Card } from './card.schema';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from './enums';

export const Cards: Card[] = [
    {
        card_id: 1,
        name: 'Attack',
        rarity: CardRarityEnum.Starter,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 5 Damage',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        base_value: 5,
                        calculated_value: 5,
                        targeted: CardTargetedEnum.Enemy,
                    },
                },
            ],
            statuses: {},
        },
    },
    {
        card_id: 2,
        name: 'Attack+',
        rarity: CardRarityEnum.Starter,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 8 Damage',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        base_value: 8,
                        calculated_value: 8,
                        targeted: CardTargetedEnum.Enemy,
                    },
                },
            ],
            statuses: {},
        },
    },
    {
        card_id: 13,
        name: 'Lunge',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 4 damage twice\nDraw 1 card',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        base_value: 4,
                        calculated_value: 4,
                        targeted: CardTargetedEnum.Enemy,
                        times: 2,
                    },
                },
                {
                    name: EffectName.DrawCard,
                    args: {
                        cards_to_take: 1,
                    },
                },
            ],
            statuses: {},
        },
    },
    {
        card_id: 14,
        name: 'Lunge+',
        rarity: CardRarityEnum.Common,
        card_type: CardTypeEnum.Attack,
        pool: 'knight',
        energy: 1,
        description: 'Deal 4 damage twice\nDraw 2 card',
        keywords: [],
        properties: {
            effects: [
                {
                    name: EffectName.Damage,
                    args: {
                        base_value: 4,
                        calculated_value: 4,
                        targeted: CardTargetedEnum.Enemy,
                        times: 2,
                    },
                },
                {
                    name: EffectName.DrawCard,
                    args: {
                        cards_to_take: 2,
                    },
                },
            ],
            statuses: {},
        },
    },
];
