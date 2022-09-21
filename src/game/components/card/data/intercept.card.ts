import { intercept } from 'src/game/status/intercept/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const InterceptCard: Card = {
    cardId: 49,
    name: 'Intercept',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description: `Reduce damage taken by 50% for this turn`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: intercept.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const InterceptCardUpgraded: Card = {
    cardId: 50,
    name: 'Intercept+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description: `Reduce damage taken by 50% for 2 turns`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: intercept.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
