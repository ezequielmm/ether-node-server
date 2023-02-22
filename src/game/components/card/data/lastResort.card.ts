import { damageEffect } from 'src/game/effects/damage/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardEnergyEnum,
    CardTargetedEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const LastResortCardUpgraded: Card = {
    cardId: 142,
    name: 'Last Resort+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal X damage to yourself and X times {${damageEffect.name}} damage to an enemy`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    useEnergyAsValue: true,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 9,
                    useEnergyAsMultiplier: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const LastResortCard: Card = {
    cardId: 141,
    name: 'Last Resort',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal X damage to yourself and X times {${damageEffect.name}} damage to an enemy`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    useEnergyAsValue: true,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 9,
                    useEnergyAsMultiplier: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: LastResortCardUpgraded.cardId,
    isActive: true,
};
