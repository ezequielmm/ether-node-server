import { damageEffect } from 'src/game/effects/damage/constants';
import { distraught } from 'src/game/status/distraught/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BackHandCardUpgraded: Card = {
    cardId: 68,
    name: 'Backhand+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. 
    Inflict {${distraught.name}} Distraught.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 14,
                },
            },
        ],
        statuses: [
            {
                name: distraught.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const BackHandCard: Card = {
    cardId: 67,
    name: 'Backhand',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. 
    Inflict {${distraught.name}} Distraught.`,
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
        ],
        statuses: [
            {
                name: distraught.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: BackHandCardUpgraded.cardId,
    isActive: true,
};
