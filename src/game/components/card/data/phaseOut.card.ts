
import { elementalStatus } from 'src/game/status/elemental/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
//import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';

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
        effects: [],
        statuses: [
            {
                name: elementalStatus.name,
                attachTo: CardTargetedEnum.Self,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const PhaseOutCard: Card = {
    cardId: 554,
    name: 'Phase Out',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 2,
    description: `Ignore all physical damage next turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
                {
                    name: elementalStatus.name,
                    attachTo: CardTargetedEnum.Self,
                    args: {
                        counter: 1,
                    },
                },
            ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: PhaseOutCardUpgraded.cardId,
    isActive: true,
};
