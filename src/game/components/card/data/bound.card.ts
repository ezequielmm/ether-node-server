import { CardKeywordEnum, CardRarityEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const WoundedCard: Card = {
    cardId: 504,
    name: 'Bound',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'knight',
    energy: 1,
    description: '',
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
