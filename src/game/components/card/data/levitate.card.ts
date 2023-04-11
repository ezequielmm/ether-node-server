import { dodge } from 'src/game/status/dodge/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const LevitateCardUpgraded: Card = {
    cardId: 138,
    name: 'Levitate+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Gain {${dodge.name}} Dodge`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: dodge.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const LevitateCard: Card = {
    cardId: 137,
    name: 'Levitate',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Gain {${dodge.name}} Dodge`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: dodge.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: LevitateCardUpgraded.cardId,
    isActive: true,
};
