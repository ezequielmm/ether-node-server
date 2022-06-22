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
                        base: 5,
                        value: 5,
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
                        base: 8,
                        value: 8,
                        targeted: CardTargetedEnum.Enemy,
                    },
                },
            ],
            statuses: {},
        },
    },
];
