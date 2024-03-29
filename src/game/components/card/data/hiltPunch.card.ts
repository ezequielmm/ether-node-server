import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const HiltPunchCardUpgraded: Card = {
    cardId: 32,
    name: 'Hilt Punch+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} damage. Lower this card’s damage by 1 each use during this combat.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 9,
                    decreaseValue: true,
                    decrementBy: 1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const HiltPunchCard: Card = {
    cardId: 31,
    name: 'Hilt Punch',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} damage. Lower this card’s damage by 1 each use during this combat.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 6,
                    decreaseValue: true,
                    decrementBy: 1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: HiltPunchCardUpgraded.cardId,
    isActive: true,
};
