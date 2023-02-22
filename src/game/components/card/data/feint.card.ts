import { removeDefenseEffect } from 'src/game/effects/removeDefense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const FeintCardUpgraded: Card = {
    cardId: 46,
    name: 'Feint+',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Remove all Defense from all enemies`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: removeDefenseEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 0,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const FeintCard: Card = {
    cardId: 45,
    name: 'Feint',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Remove all Defense from an enemy`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: removeDefenseEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 0,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: FeintCardUpgraded.cardId,
    isActive: true,
};
