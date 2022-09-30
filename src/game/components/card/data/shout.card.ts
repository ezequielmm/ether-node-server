import { fatigue } from 'src/game/status/fatigue/constants';
import { resolve } from 'src/game/status/resolve/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const ShoutCardUpgraded: Card = {
    cardId: 66,
    name: 'Shout+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Inflict 2 Fatigue. \nGain 2 Resolve.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: fatigue.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 2,
                },
            },
            {
                name: resolve.name,
                attachTo: CardTargetedEnum.Self,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: true,
};

export const ShoutCard: Card = {
    cardId: 65,
    name: 'Shout',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Inflict 1 Fatigue. \nGain 1 Resolve.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: fatigue.name,
                attachTo: CardTargetedEnum.Enemy,
                args: {
                    counter: 1,
                },
            },
            {
                name: resolve.name,
                attachTo: CardTargetedEnum.Self,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: ShoutCardUpgraded.cardId,
};
