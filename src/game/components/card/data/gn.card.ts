import { fortitude } from 'src/game/status/fortitude/constants';
import { resolve } from 'src/game/status/resolve/constants';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { spirited } from 'src/game/status/spirited/contants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardKeywordEnum,
    CardTargetedEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const GNCard: Card = {
    cardId: 119,
    name: 'GN',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 3,
    description:
        'Gain 1 Resolve, 1 Fortitude, 1 Spirited and 1 Spikes. End turn.',
    keywords: [CardKeywordEnum.EndTurn],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolve.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: 1,
                },
            },
            {
                name: fortitude.name,
                args: { attachTo: CardTargetedEnum.Player, value: 1 },
            },
            {
                name: spirited.name,
                args: { attachTo: CardTargetedEnum.Player, value: 1 },
            },
            {
                name: spikesStatus.name,
                args: { attachTo: CardTargetedEnum.Player, value: 1 },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const GNCardUpgraded: Card = {
    cardId: 120,
    name: 'GN+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description:
        'Gain 1 Resolve, 1 Fortitude, 1 Spirited and 1 Spikes. End turn.',
    keywords: [CardKeywordEnum.EndTurn],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolve.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: 1,
                },
            },
            {
                name: fortitude.name,
                args: { attachTo: CardTargetedEnum.Player, value: 1 },
            },
            {
                name: spirited.name,
                args: { attachTo: CardTargetedEnum.Player, value: 1 },
            },
            {
                name: spikesStatus.name,
                args: { attachTo: CardTargetedEnum.Player, value: 1 },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
