import { doubleBurn } from 'src/game/effects/doubleBurn/constants';
import { burn } from 'src/game/status/burn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const KindleCard: Card = {
    cardId: 91,
    name: 'Kindle',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Apply {${doubleBurn.name}} Burn\nDouble any Burn on all enemies`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: doubleBurn.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 1,
                },
            },
        ],
        statuses: [
            {
                name: burn.name,
                args: {
                    attachTo: CardTargetedEnum.Enemy,
                    counter: 1,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

export const KindleCardUpgraded: Card = {
    cardId: 92,
    name: 'Kindle+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Apply {${doubleBurn.name}} Burn\nDouble any Burn on all enemies`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: doubleBurn.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    value: 1,
                },
            },
        ],
        statuses: [
            {
                name: burn.name,
                args: {
                    attachTo: CardTargetedEnum.Enemy,
                    counter: 2,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: true,
};
