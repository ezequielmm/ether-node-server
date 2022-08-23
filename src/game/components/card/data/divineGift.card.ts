import { gifted } from 'src/game/status/gifted/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

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
                args: {
                    value: 4,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

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
                args: {
                    value: 4,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
