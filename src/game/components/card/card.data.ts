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
                        base_value: 5,
                        calculated_value: 5,
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
                        base_value: 8,
                        calculated_value: 8,
                        targeted: CardTargetedEnum.Enemy,
                        times: 1,
                    },
                },
            ],
            statuses: [],
        },
    },
];
