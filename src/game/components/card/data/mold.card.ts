import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardKeywordEnum } from '../card.enum';
import { Card } from '../card.schema';
import { energyEffect } from 'src/game/effects/energy/constants';


/*
TODO:
- validate if we can send -1 as value in energyEffect
- percistance: yes (in keywords)
- map effect


Notes: Added to deck by Mold actions
*/
export const MoldCard: Card = {
    cardId: 553,
    name: 'Mold',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,//we shoud have kind of "map" cards?
    pool: 'knight',
    energy: 0,
    description: `Reduce ${energyEffect.name} by 1 if this card is in hand by the start of the turn. Discard.`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [
            {
                effect: energyEffect.name,
                target: CardTargetedEnum.Self,
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
