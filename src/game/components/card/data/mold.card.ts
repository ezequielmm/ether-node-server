import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardKeywordEnum } from '../card.enum';
import { Card } from '../card.schema';
import { energyEffect } from 'src/game/effects/energy/constants';

export const MoldCard: Card = {
    cardId: 554,
    name: 'Mold',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,//we shoud have kind of "map" cards?
    pool: 'knight',
    energy: 0,
    description: `Reduce ${energyEffect.name} by 1 if this card is in hand by the start of the turn. Exhaust.`,
    keywords: [CardKeywordEnum.Fade, CardKeywordEnum.Unplayable],
    properties: {
        effects: [
            {
                effect: energyEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: -1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    triggerOnDrawn: true,
    isActive: true,
};
