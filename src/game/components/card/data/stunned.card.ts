import { CardKeywordEnum, CardRarityEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const StunnedCard: Card = {
    cardId: 501,
    name: 'Stunned',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'knight',
    energy: 0,
    description: '',
    keywords: [CardKeywordEnum.Fade, CardKeywordEnum.Unplayable],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
