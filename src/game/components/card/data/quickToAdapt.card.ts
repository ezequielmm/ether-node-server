import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const QuickToAdaptCardUpgraded: Card = {
    cardId: 102,
    name: 'Quick to Adapt+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain {${defenseEffect.name}} defense for each enemy.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 6,
                    useEnemies: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const QuickToAdaptCard: Card = {
    cardId: 101,
    name: 'Quick to Adapt',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain {${defenseEffect.name}} defense for each enemy.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 4,
                    useEnemies: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: QuickToAdaptCardUpgraded.cardId,
    isActive: true,
};
