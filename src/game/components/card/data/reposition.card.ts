import { repositionEffect } from 'src/game/effects/reposition/contants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';


export const RepositionCardUpgraded: Card = {
    cardId: 126,
    name: 'Reposition',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Shuffle all of your cards and replace your hand.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: repositionEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 0,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const RepositionCard: Card = {
    cardId: 125,
    name: 'Reposition',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Shuffle all of your cards and replace your hand.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: repositionEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 0,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: RepositionCardUpgraded.cardId,
};
