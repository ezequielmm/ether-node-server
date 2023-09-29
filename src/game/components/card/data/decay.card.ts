import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';


/*
TODO: 
- percistance: yes (in keywords)
- map effect
- card effect logic

Notes: Added to deck by Infect actions
*/
export const DecayCard: Card = {
    cardId: 552,
    name: 'Decay',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,//we shoud have kind of "map" cards?
    pool: 'knight',
    energy: 0,
    description: `Receive 2 damage if in hand by the end of the turn `,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    isActive: true,
};
