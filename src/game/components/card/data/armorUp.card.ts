import { defenseEffect } from 'src/game/effects/defense/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardKeywordEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const ArmorUpCard: Card = {
    cardId: 173,
    name: 'Armor Up',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Gain {${defenseEffect.name}} Defense. Exhaust`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 5,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const ArmorUpCardUpgraded: Card = {
    cardId: 174,
    name: 'Armor Up+',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Gain {${defenseEffect.name}} Defense. Exhaust`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 7,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
