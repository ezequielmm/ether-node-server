import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum, CardKeywordEnum } from '../card.enum';
import { Card } from '../card.schema';


/*
TODO: 

- percistance: yes (in keywords)
- map effect


Notes: Added to deck by Infect actions
*/
export const DecayCard: Card = {
    cardId: 552,
    name: 'Decay',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
    description: `Receive 2 ${damageEffect.name} if in hand by the end of the turn `,
    keywords: [CardKeywordEnum.Unplayable],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    triggerAtEndOfTurn: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                    useInitialValue: true
                },
            },
        ],
        statuses: [],
    },
    isActive: true,
    
};
