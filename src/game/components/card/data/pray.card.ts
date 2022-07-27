import { fortitude } from 'src/game/status/fortitude/constants';
import { resolve } from 'src/game/status/resolve/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const PrayCard: Card = {
    cardId: 23,
    name: 'Pray',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description:
        'At the beginning of your next turn gain 1 [Resolve] and 1 [Fortitude].',
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolve.name,
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Player,
                },
            },
            {
                name: fortitude.name,
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const PrayCardUpgraded: Card = {
    cardId: 24,
    name: 'Pray+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description:
        'At the beginning of your next two turns gain 1 [Resolve] and 1 [Fortitude].',
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolve.name,
                args: {
                    value: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
            {
                name: fortitude.name,
                args: {
                    value: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};
