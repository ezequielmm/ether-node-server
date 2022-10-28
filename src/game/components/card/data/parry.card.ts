import { defenseEffect } from 'src/game/effects/defense/constants';
import { fortitude } from 'src/game/status/fortitude/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';
import { PrayCardUpgraded } from './pray.card';

export const ParryCardUpgraded: Card = {
    cardId: 38,
    name: 'Parry+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Deal {${defenseEffect.name}} defense. Gain {${fortitude.name}} fortitude.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 8,
                },
            },
        ],
        statuses: [
            {
                name: fortitude.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 3,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};

export const ParryCard: Card = {
    cardId: 37,
    name: 'Parry',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Deal {${defenseEffect.name}} defense. Gain {${fortitude.name}} fortitude.`,
    keywords: [],
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
        statuses: [
            {
                name: fortitude.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: PrayCardUpgraded.cardId,
};
