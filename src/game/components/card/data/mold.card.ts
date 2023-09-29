import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { energyEffect } from 'src/game/effects/energy/constants';


/*
TODO:
- percistance: yes (in keywords)
- map effect
- card effect logic

Notes: Added to deck by Mold actions
*/
export const MoldCard: Card = {
    cardId: 553,
    name: 'Mold',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,//we shoud have kind of "map" cards?
    pool: 'knight',
    energy: 0,
    description: `Reduce energy by 1 if this card is in hand by the start of the turn. Discard.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: energyEffect.name, //what efect should be??
                target: CardTargetedEnum.Self,
                args: {
                    value: 1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    isActive: true,
};
