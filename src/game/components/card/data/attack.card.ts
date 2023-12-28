import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const AttackCardUpgraded: Card = {
    cardId: 2,
    name: 'Attack+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${8}} + {${resolveStatus.name}} Damage`,
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
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const AttackCard: Card = {
    cardId: 1,
    name: 'Attack',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${6}} + {${resolveStatus.name}} Damage`,
    keywords: [],
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
    upgradedCardId: AttackCardUpgraded.cardId,
    isActive: true,
};
