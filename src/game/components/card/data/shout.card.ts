import { fatigue } from 'src/game/status/fatigue/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const ShoutCardUpgraded: Card = {
    cardId: 66,
    name: 'Shout+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Inflict {${fatigue.name}} Fatigue. \nGain {${resolveStatus.name}} Resolve.`,
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
                name: resolveStatus.name,
                attachTo: CardTargetedEnum.Self,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: false,
};

export const ShoutCard: Card = {
    cardId: 65,
    name: 'Shout',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Inflict {${fatigue.name}} Fatigue. \nGain {${resolveStatus.name}} Resolve.`,
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
                name: resolveStatus.name,
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
    isActive: false,
};
