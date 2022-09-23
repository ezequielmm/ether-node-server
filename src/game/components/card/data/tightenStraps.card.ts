import { armoredUp } from 'src/game/status/armoredUp/contants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const TightenStrapsCard: Card = {
    cardId: 71,
    name: 'Tighten Straps',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 1,
    description: `Start each turn with 1 Armor Up card`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: armoredUp.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                    cardsToAdd: [173],
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const TightenStrapsCardUpgraded: Card = {
    cardId: 72,
    name: 'Tighten Straps+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 1,
    description: `Start each turn with 1 Armor Up+ card`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: armoredUp.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                    cardsToAdd: [174],
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
