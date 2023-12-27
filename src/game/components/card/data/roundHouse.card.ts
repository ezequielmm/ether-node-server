import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const RoundHouseCardUpgraded: Card = {
    cardId: 128,
    name: 'Roundhouse+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} damage twice.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                times: 2,
                args: {
                    value: 10,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const RoundHouseCard: Card = {
    cardId: 127,
    name: 'Roundhouse',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} damage twice.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                times: 2,
                args: {
                    value: 7,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: RoundHouseCardUpgraded.cardId,
    isActive: true,
};
