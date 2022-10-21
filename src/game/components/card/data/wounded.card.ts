import { CardKeywordEnum, CardRarityEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const WoundedCard: Card = {
    cardId: 502,
    name: 'Wounded',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'knight',
    energy: 0,
    description: '',
    keywords: [CardKeywordEnum.Unplayable],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
