import { damageEffect } from 'src/game/effects/damage/constants';
import { doubleResolve } from 'src/game/effects/doubleResolve/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const UltraLethalityCardUpgraded: Card = {
    cardId: 148,
    name: 'Ultra Lethality+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage twice, with double the effect of Resolve`,
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
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 15,
                },
            },
            {
                effect: doubleResolve.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: Number.NaN,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    isActive: true,
};

export const UltraLethalityCard: Card = {
    cardId: 147,
    name: 'Ultra Lethality',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage twice, with double the effect of Resolve`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 10,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 10,
                },
            },
            {
                effect: doubleResolve.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: Number.NaN,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: UltraLethalityCardUpgraded.cardId,
    isActive: true,
};
