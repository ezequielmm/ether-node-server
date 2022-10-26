import { CardRarityEnum, CardTypeEnum, CardKeywordEnum } from '../card.enum';
import { Card } from '../card.schema';

export const EnnuiCard: Card = {
    cardId: 551,
    name: 'Ennui',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Curse,
    pool: 'Neutral',
    energy: 0,
    description: `Unplayable. Fade`,
    keywords: [CardKeywordEnum.Unplayable, CardKeywordEnum.Fade],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
