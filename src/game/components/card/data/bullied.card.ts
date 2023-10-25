import { CardRarityEnum, CardTypeEnum, CardKeywordEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BulliedCard: Card = {
    cardId: 508,
    name: 'Bullied',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'Status',
    energy: 0,
    description: `Your hands shake and doubt overcomes you, freezing you in place.`,
    keywords: [CardKeywordEnum.Unplayable],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    isActive: true,
};
