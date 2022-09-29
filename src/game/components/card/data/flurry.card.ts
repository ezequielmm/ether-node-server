import { flurry } from 'src/game/effects/flurry/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardEnergyEnum,
} from '../card.enum';
import { Card } from '../card.schema';



export const FlurryCardUpgraded: Card = {
    cardId: 84,
    name: 'Flurry+',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal {${flurry.name}} damage to 3 random enemies X times`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: flurry.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 4,
                },
            },
            {
                effect: flurry.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 4,
                },
            },
            {
                effect: flurry.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 4,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
};

export const FlurryCard: Card = {
    cardId: 83,
    name: 'Flurry',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal {${flurry.name}} damage to 3 random enemies X times`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: flurry.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 3,
                },
            },
            {
                effect: flurry.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 3,
                },
            },
            {
                effect: flurry.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 3,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: FlurryCardUpgraded.cardId,
};
