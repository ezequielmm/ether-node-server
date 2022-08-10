import { damageEffect } from 'src/game/effects/damage/constants';
import { resolve } from 'src/game/status/resolve/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

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
        ],
        statuses: [
            {
                name: resolve.name,
                args: {
                    value: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

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
        ],
        statuses: [
            {
                name: resolve.name,
                args: {
                    value: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};
