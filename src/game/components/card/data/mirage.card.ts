import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

/*
TODO:
- cardType
- card effects

Notes: Mystified characters will pick and use random cards from their hand (energy costs still apply)
*/

export const MirageCard: Card = {
    cardId: 560,
    name: 'Mirage',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 0,
    description: `If this card is on hand by the end of turn, gain 1 Mistified. Discard.`,
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
    isActive: true,
};
