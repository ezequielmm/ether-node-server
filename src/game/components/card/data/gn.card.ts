import { fortitude } from 'src/game/status/fortitude/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { spirited } from 'src/game/status/spirited/contants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardKeywordEnum,
    CardTargetedEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const GNCardUpgraded: Card = {
    cardId: 120,
    name: 'GN+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description:
        `Gain {${resolveStatus.name}} Resolve, {${fortitude.name}} Fortitude, {${spirited.name}} Spirited and {${spikesStatus.name}} Spikes. End turn.`,
    keywords: [CardKeywordEnum.EndTurn],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolveStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
            {
                name: fortitude.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
            {
                name: spirited.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
            {
                name: spikesStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const GNCard: Card = {
    cardId: 119,
    name: 'GN',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 3,
    description:
        `Gain {${resolveStatus.name}} Resolve, {${fortitude.name}} Fortitude, {${spirited.name}} Spirited and {${spikesStatus.name}} Spikes. End turn.`,
    keywords: [CardKeywordEnum.EndTurn],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolveStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
            {
                name: fortitude.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
            {
                name: spirited.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
            {
                name: spikesStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: GNCardUpgraded.cardId,
    isActive: true,
};
