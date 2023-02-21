import { gifted } from 'src/game/status/gifted/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const DivineGiftCardUpgraded: Card = {
    cardId: 52,
    name: 'Divine Gift+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 3,
    description: `Start each turn with {${gifted.name}} defense`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: gifted.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 7,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: false,
};

export const DivineGiftCard: Card = {
    cardId: 51,
    name: 'Divine Gift',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 3,
    description: `Start each turn with {${gifted.name}} defense`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: gifted.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 4,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: DivineGiftCardUpgraded.cardId,
    isActive: false,
};
