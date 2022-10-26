import { CardRarityEnum, CardTypeEnum, CardKeywordEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BulliedCard: Card = {
    cardId: 508,
    name: 'Bullied',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'Status',
    energy: 0,
    description: `Unplayable`,
    keywords: [CardKeywordEnum.Unplayable],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
