import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { galvanize } from 'src/game/status/galvanize/constants';

/*
TODO:

-for both cards
    -verify card type
    -cards effects logic (All attack actions grant 3 defense this turn.)
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
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    statusName: galvanize.name,
                    statusArgs: {
                        value: 4,
                        counter: 1
                    },
                },
            }
        ],
        statuses: [],
    },
    showPointer: false,
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
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    statusName: galvanize.name,
                    statusArgs: {
                        value: 3,
                        counter: 1
                    },
                },
            }
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: GalvanizeCardUpgraded.cardId,
    isActive: true,
};
