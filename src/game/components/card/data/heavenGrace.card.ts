import { healEffect } from 'src/game/effects/heal/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';



export const HeavenGraceCardUpgraded: Card = {
    cardId: 76,
    name: 'Heaven’s Grace+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Heal {${healEffect.name}} hp`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: healEffect.name,
                target: CardTargetedEnum.Player,
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

export const HeavenGraceCard: Card = {
    cardId: 75,
    name: 'Heaven’s Grace',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Heal {${healEffect.name}} hp`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: healEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: HeavenGraceCardUpgraded.cardId,
};
