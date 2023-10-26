import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardKeywordEnum } from '../card.enum';
import { Card } from '../card.schema';
import { energyEffect } from 'src/game/effects/energy/constants';


/*
TODO:
- map effect
*/
export const MoldCard: Card = {
    cardId: 553,
    name: 'Mold',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,//we shoud have kind of "map" cards?
    pool: 'knight',
    energy: 0,
    description: `Reduce ${energyEffect.name} by 1 if this card is in hand by the start of the turn. Exahust.`,
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
