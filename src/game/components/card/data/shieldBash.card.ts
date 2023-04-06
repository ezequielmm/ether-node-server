import {
    shieldBashEffect,
    shieldBashUpgradedEffect,
} from 'src/game/effects/shieldBash/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

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
                effect: shieldBashUpgradedEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: null,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

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
                effect: shieldBashEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: null,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: ShieldBashCardUpgraded.cardId,
    isActive: true,
};
