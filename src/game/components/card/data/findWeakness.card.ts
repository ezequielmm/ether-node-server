import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const FindWeaknessCardUpgraded: Card = {
    cardId: 12,
    name: 'Find Weakness+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} damage {${damageEffect.name}|times} {p:${damageEffect.name}|times:time:times}. Double these values this combat.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                times: 1,
                args: {
                    value: 1,
                    doubleValuesWhenPlayed: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const FindWeaknessCard: Card = {
    cardId: 11,
    name: 'Find Weakness',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} damage {${damageEffect.name}|times} {p:${damageEffect.name}|times:time:times}. Double these values this combat.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                times: 1,
                args: {
                    value: 1,
                    doubleValuesWhenPlayed: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: FindWeaknessCardUpgraded.cardId,
    isActive: true,
};
