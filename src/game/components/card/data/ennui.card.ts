import { CardRarityEnum, CardTypeEnum, CardKeywordEnum } from '../card.enum';
import { Card } from '../card.schema';

export const EnnuiCard: Card = {
    cardId: 551,
    name: 'Ennui',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Curse,
    pool: 'Neutral',
    energy: 0,
    description: `Your heart feels empty and nothing makes sense anymore. You might as well stop fighting.`,
    keywords: [CardKeywordEnum.Unplayable, CardKeywordEnum.Fade],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    isActive: true,
};
