import { damageEffect } from 'src/game/effects/damage/constants';
import { knockDown } from 'src/game/effects/knockDown/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const KnockDownCardUpgraded: Card = {
    cardId: 108,
    name: 'Knock Down+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${12}} + {${resolveStatus.name}} damage. If your last played card was an attack, Stun the enemy`,
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
                    value: null,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const KnockDownCard: Card = {
    cardId: 107,
    name: 'Knock Down',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${8}} + {${resolveStatus.name}} damage. If your last played card was an attack, Stun the enemy`,
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
                    value: null,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: KnockDownCardUpgraded.cardId,
    isActive: true,
};
