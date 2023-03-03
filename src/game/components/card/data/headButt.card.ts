import { damageEffect } from 'src/game/effects/damage/constants';
import { headButt } from 'src/game/effects/headButt/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const HeadButtCardUpgraded: Card = {
    cardId: 34,
    name: 'Head Butt+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. If enemy is undefended, Inflict Confusion.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 11,
                },
            },
            {
                effect: headButt.name,
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
    isActive: false,
};

export const HeadButtCard: Card = {
    cardId: 33,
    name: 'Head Butt',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. If enemy is undefended, Inflict Confusion.`,
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
                effect: headButt.name,
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
    upgradedCardId: HeadButtCardUpgraded.cardId,
    isActive: false,
};
