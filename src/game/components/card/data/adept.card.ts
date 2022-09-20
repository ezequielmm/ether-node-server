import { gifted } from 'src/game/status/gifted/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const AdeptCard: Card = {
    cardId: 133,
    name: 'Adept',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 1,
    description: `Start each turn with {${gifted.name}} defense`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: gifted.name,
                args: {
                    counter: 3,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const AdeptCardUpgraded: Card = {
    cardId: 134,
    name: 'Adept+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 1,
    description: `Start each turn with {${gifted.name}} defense`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: gifted.name,
                args: {
                    counter: 5,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
