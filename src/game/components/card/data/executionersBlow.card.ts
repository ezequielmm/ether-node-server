import { damageEffect } from 'src/game/effects/damage/constants';
import { executionersBlowEffect } from 'src/game/effects/executionersBlow/contants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const ExecutionersBlowCardUpgraded: Card = {
    cardId: 156,
    name: 'Executioner’s Blow+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. If this kills an enemy, return it to your hand and it costs 0 this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 15,
                },
            },
            {
                effect: executionersBlowEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    upgraded: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const ExecutionersBlowCard: Card = {
    cardId: 155,
    name: 'Executioner’s Blow',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. If this kills an enemy, return it to your hand and it costs 0 this turn.`,
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
                effect: executionersBlowEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    upgraded: false,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: ExecutionersBlowCardUpgraded.cardId,
    isActive: true,
};
