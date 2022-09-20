import { damageEffect } from 'src/game/effects/damage/constants';
import { onARollEffect } from 'src/game/effects/onARoll/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const OnARollCard: Card = {
    cardId: 53,
    name: 'On a Roll',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. 
    If this kills target, Gain {${onARollEffect.name}} energy.`,
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
                effect: onARollEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
};

export const OnARollCardUpgraded: Card = {
    cardId: 54,
    name: 'On a Roll+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Deal {${damageEffect.name}} damage. 
    If this kills target, Gain {${onARollEffect.name}} energy.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 16,
                },
            },
            {
                effect: onARollEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
};
