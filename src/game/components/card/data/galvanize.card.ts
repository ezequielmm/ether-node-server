import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

/*
TODO:

-for both cards
    -verify card type
    -cards effects logic (All attack actions grant 4 defense this turn.)
*/

export const GalvanizeCardUpgraded: Card = {
    cardId: 568,
    name: 'Galvanize+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `All attack actions grant 4 ${defenseEffect.name} this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 4,
                },
            }
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const GalvanizeCard: Card = {
    cardId: 567,
    name: 'Galvanize',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 2,
    description: `All attack actions grant 3 ${defenseEffect.name} this turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 3,
                },
            }
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: GalvanizeCardUpgraded.cardId,
    isActive: true,
};