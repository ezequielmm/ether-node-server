import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const ShieldBashCard: Card = {
    cardId: 29,
    name: 'Shield Bash',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal damage equal to your Defense.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 1, // Value is calculated in the effect
                    useDefense: true,
                    multiplier: 1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
};

export const ShieldBashCardUpgraded: Card = {
    cardId: 30,
    name: 'Shield Bash+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal damage equal to 2x your Defense.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 1, // Value is calculated in the effect
                    useDefense: true,
                    multiplier: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
};
