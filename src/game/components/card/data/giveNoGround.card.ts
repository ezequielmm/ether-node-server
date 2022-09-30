import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const GiveNoGroundCardUpgraded: Card = {
    cardId: 130,
    name: 'Give no Ground+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain {${defenseEffect.name}} defense for each enemy planning to attack.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 9,
                    useAttackingEnemies: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
};

export const GiveNoGroundCard: Card = {
    cardId: 129,
    name: 'Give no Ground',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain {${defenseEffect.name}} defense for each enemy planning to attack.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 6,
                    useAttackingEnemies: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: GiveNoGroundCardUpgraded.cardId,
};
