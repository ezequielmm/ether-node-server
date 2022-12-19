import { flurry, flurryPlus } from 'src/game/effects/flurry/constants';
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
    description: `Deal 7 damage X + 1 times to random enemies`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: flurryPlus.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 7,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const FlurryCard: Card = {
    cardId: 83,
    name: 'Flurry',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal 6 damage X times to random enemies`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: flurry.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 6,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: FlurryCardUpgraded.cardId,
    isActive: true,
};
