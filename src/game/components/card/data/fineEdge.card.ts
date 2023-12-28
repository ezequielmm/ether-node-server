import { damageEffect } from 'src/game/effects/damage/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardKeywordEnum,
    CardTargetedEnum,
} from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const FineEdgeCardUpgraded: Card = {
    cardId: 172,
    name: 'Fine Edge+',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
    description: `Deal {${7}} + {${resolveStatus.name}} damage. Exhaust`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 7,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const FineEdgeCard: Card = {
    cardId: 171,
    name: 'Fine Edge',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
    description: `Deal {${5}} + {${resolveStatus.name}} damage. Exhaust`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 5,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: FineEdgeCardUpgraded.cardId,
    isActive: true,
};
