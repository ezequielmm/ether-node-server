import { CardKeywordEnum, CardRarityEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const MossCard: Card = {
    cardId: 511,
    name: 'Moss',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'knight',
    energy: 0,
    description: 'Covered in moss',
    keywords: [CardKeywordEnum.Unplayable, CardKeywordEnum.Fade],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
