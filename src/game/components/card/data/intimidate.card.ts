import { confusion } from 'src/game/status/confusion/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const IntimidateCard: Card = {
    cardId: 25,
    name: 'Intimidate',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description: `Inflict {${confusion.name}} confusion`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: confusion.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

export const IntimidateCardUpgraded: Card = {
    cardId: 26,
    name: 'Intimidate+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description: `Inflict {${confusion.name}} on all enemies`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: confusion.name,
                attachTo: CardTargetedEnum.AllEnemies,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
