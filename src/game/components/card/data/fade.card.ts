import { dodge } from 'src/game/status/dodge/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

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
                args: {
                    counter: 1,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const FadeCardUpgraded: Card = {
    cardId: 42,
    name: 'Fade+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description: `Dodge the next 2 attack`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: dodge.name,
                args: {
                    counter: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
