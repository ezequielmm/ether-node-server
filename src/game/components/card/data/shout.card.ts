import { resolve } from 'path';
import { fatigue } from 'src/game/status/fatigue/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

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
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Enemy,
                },
            },
            {
                name: resolve.name,
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Self,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

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
                args: {
                    value: 2,
                    attachTo: CardTargetedEnum.Enemy,
                },
            },
            {
                name: resolve.name,
                args: {
                    value: 2,
                    attachTo: CardTargetedEnum.Self,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: true,
};
