import { damageEffect } from 'src/game/effects/damage/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { mistifiedStatus } from 'src/game/status/mistified/constants';

export const MirageCard: Card = {
    cardId: 560,
    name: 'Mirage',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Curse,
    pool: 'knight',
    energy: 0,
    description: `If this card is on hand by the end of turn, gain 1 Mistified. Discard.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    triggerAtEndOfTurn: {
        effects:[],
        statuses:[
            {
                name: mistifiedStatus.name,
                    attachTo: CardTargetedEnum.Player,
                    args: {
                        counter: 1,
                    },
            }
            
        ]
    },
    isActive: true,
};
