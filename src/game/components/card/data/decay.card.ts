import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';


/*
TODO: 
-validate if triggerAtEndOfTurn works for trigeer de card efect at the end of the turn
-
- percistance: yes (in keywords)
- map effect


Notes: Added to deck by Infect actions
*/
export const DecayCard: Card = {
    cardId: 552,
    name: 'Decay',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Curse,
    pool: 'knight',
    energy: 0,
    description: `Receive 2 ${damageEffect.name} if in hand by the end of the turn `,
    keywords: [],
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
                },
            },
        ],
        statuses: [],
    },
    isActive: true,
};
