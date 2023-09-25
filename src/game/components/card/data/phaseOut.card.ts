import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

/*
TODO for both, upraded and normal Phase out:
- cardType
- card effects
Notes: Elemental / Magic damage still applies
*/

export const PhaseOutCardUpgraded: Card = {
    cardId: 555,
    name: 'Phase Out+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Ignore all physical damage for the next 2 turns.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const PhaseOutCard: Card = {
    cardId: 554,
    name: 'Phase Out',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 2,
    description: `Ignore all physical damage next turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: PhaseOutCardUpgraded.cardId,
    isActive: true,
};
