import { forceField } from 'src/game/status/forceField/contants';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const ForceFieldCard: Card = {
    cardId: 151,
    name: 'Force Field',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 3,
    description: `Take no damage next round`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [],
        statuses: [
            {
                name: forceField.name,
                attachTo: CardTargetedEnum.Player,
                args: { counter: 1 },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const ForceFieldCardUpgraded: Card = {
    cardId: 152,
    name: 'Force Field+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 3,
    description: `Take no damage next round`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: forceField.name,
                attachTo: CardTargetedEnum.Player,
                args: { counter: 1 },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
