import { damageEffect } from 'src/game/effects/damage/constants';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const BurnedCard: Card = {
    cardId: 503,
    name: 'Burned',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'knight',
    energy: 0,
    description: `Take {${damageEffect.name}} damage if in hand at end of turn. Fade`,
    keywords: [CardKeywordEnum.Fade],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    triggerAtEndOfTurn: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    isActive: true,
};
