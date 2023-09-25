import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

/*
TODO for both, upraded and normal Rebuke:
- cardType
- card effects

Rebuke notes: The player picks a target. All debuffs attempted this turn by that target won’t work (already existing debuffs are not affected).
Rebuke+ notes: Debuffs attempted this turn by any enemy won’t work (already existing debuffs are not affected).
*/

export const RebukeCardUpgraded: Card = {
    cardId: 557,
    name: 'Rebuke+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 2,
    description: `Ignore all debuffs attempted by enemies this turn.`,
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

export const RebukeCard: Card = {
    cardId: 556,
    name: 'Rebuke',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Prevent debuffs from 1 enemy this turn.`,
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
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: RebukeCardUpgraded.cardId,
    isActive: true,
};
