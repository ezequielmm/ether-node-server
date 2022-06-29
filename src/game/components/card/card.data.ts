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
];
