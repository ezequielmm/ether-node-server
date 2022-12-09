import { dodge } from 'src/game/status/dodge/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const FadeCardUpgraded: Card = {
    cardId: 42,
    name: 'Fade+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description: `Dodge the next 2 attacks`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: dodge.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const FadeCard: Card = {
    cardId: 41,
    name: 'Fade',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description: `Dodge the next attack`,
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
    upgradedCardId: FadeCardUpgraded.cardId,
    isActive: true,
};
