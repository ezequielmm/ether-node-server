import { damageEffect } from 'src/game/effects/damage/constants';
import { knockDown } from 'src/game/effects/knockDown/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const KnockDownCard: Card = {
    cardId: 107,
    name: 'Knock Down',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. If your last 2 cards played were attacks, Stun your enemy`,
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
            {
                effect: knockDown.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: Number.NaN,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
};

export const KnockDownCardUpgraded: Card = {
    cardId: 108,
    name: 'Knock Down+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. If your last 2 cards played were attacks, Stun your enemy`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 12,
                },
            },
            {
                effect: knockDown.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: Number.NaN,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
};
