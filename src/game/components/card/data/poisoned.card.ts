import { damageEffect } from 'src/game/effects/damage/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardKeywordEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const PoisonedCard: Card = {
    cardId: 507,
    name: 'Poisoned',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'knight',
    energy: 0,
    description: `Take 4 damage if in hand at end of turn. \nExhaust`,
    keywords: [CardKeywordEnum.Exhaust, CardKeywordEnum.Unplayable],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    triggerAtEndOfTurn: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 4,
                },
            },
        ],
        statuses: [],
    },
    isActive: true,
};
