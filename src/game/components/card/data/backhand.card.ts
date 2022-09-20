import { damageEffect } from 'src/game/effects/damage/constants';
import { distraught } from 'src/game/status/distraught/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BackHandCard: Card = {
    cardId: 67,
    name: 'Backhand',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. 
    Inflict 1 Distraught.`,
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
                args: {
                    attachTo: CardTargetedEnum.Enemy,
                    counter: 1,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

export const BackHandCardUpgraded: Card = {
    cardId: 68,
    name: 'Backhand+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. 
    Inflict 2 Distraught.`,
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
                args: {
                    attachTo: CardTargetedEnum.Enemy,
                    counter: 2,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: true,
};
