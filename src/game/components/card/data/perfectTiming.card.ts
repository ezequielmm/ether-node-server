import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const PerfectTimingCard: Card = {
    cardId: 159,
    name: 'Perfect Timing',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `If the enemy intends to attack. Draw {${drawCardEffect.name}} defense cards`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: drawCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                    useAttackingEnemies: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const PerfectTimingCardUpgraded: Card = {
    cardId: 160,
    name: 'Perfect Timing+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `If the enemy intends to attack. Draw {${drawCardEffect.name}} defense cards`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: drawCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 3,
                    useAttackingEnemies: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
};
