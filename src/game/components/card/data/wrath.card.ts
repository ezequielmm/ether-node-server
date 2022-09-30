import { fortitude } from 'src/game/status/fortitude/constants';
import { resolve } from 'src/game/status/resolve/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const WrathCardUpgraded: Card = {
    cardId: 117,
    name: 'Wrath+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: 'Gain 2 Resolve\nGain 2 Fortitude',
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolve.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 2,
                },
            },
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
    isUpgraded: true,
};

export const WrathCard: Card = {
    cardId: 116,
    name: 'Wrath',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: 'Gain 1 Resolve\nGain 1 Fortitude',
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: resolve.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
            {
                name: fortitude.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: WrathCardUpgraded.cardId,
};
