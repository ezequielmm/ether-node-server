import { damageEffect } from 'src/game/effects/damage/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardEnergyEnum,
    CardTargetedEnum,
} from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const LastResortCardUpgraded: Card = {
    cardId: 142,
    name: 'Last Resort+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal X damage to yourself and X times {${12}} + {${resolveStatus.name}} damage to all enemies`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 12,
                    useEnergyAsMultiplier: true,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    useEnergyAsValue: true,
                },
            }
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
    description: `Deal X damage to yourself and X times {${12}} + {${resolveStatus.name}} damage to an enemy`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 12,
                    useEnergyAsMultiplier: true,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    useEnergyAsValue: true,
                },
            }
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: LastResortCardUpgraded.cardId,
    isActive: true,
};
