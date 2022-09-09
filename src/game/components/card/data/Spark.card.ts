import { doubleBurn } from 'src/game/effects/doubleBurn/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const SparkCard: Card = {
    cardId: 35,
    name: 'Spark',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Inflict  {${doubleBurn.name}} Burn`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: burn.name,
                args: {
                    attachTo: CardTargetedEnum.Enemy,
                    value: 2,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

export const SparkCardUpgraded: Card = {
    cardId: 36,
    name: 'Spark+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Inflict  {${doubleBurn.name}} Burn`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: burn.name,
                args: {
                    attachTo: CardTargetedEnum.None,
                    value: 2,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};
