import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

/*
TODO:

-for both cards
    -verify card type
    -notes:Ethereal damage can hurt normal and ethereal monsters.
    -cards effects  
*/

export const SpiritualAssaultCardUpgraded: Card = {
    cardId: 566,
    name: 'Spiritual Assault+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `All physical attacks deal ethereal damage this turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const SpiritualAssaultCard: Card = {
    cardId: 565,
    name: 'Spiritual Assault',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `All physical attacks deal ethereal damage this turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: SpiritualAssaultCardUpgraded.cardId,
    isActive: true,
};
