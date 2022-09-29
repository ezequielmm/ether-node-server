import { regenerate } from 'src/game/status/regenerate/contants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';



export const InvokeBlessingCardUpgraded: Card = {
    cardId: 80,
    name: 'Invoke Blessing+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 0,
    description: `Gain {${regenerate.name}} Regenerate`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: regenerate.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};

export const InvokeBlessingCard: Card = {
    cardId: 79,
    name: 'Invoke Blessing',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 1,
    description: `Gain {${regenerate.name}} Regenerate`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: regenerate.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: InvokeBlessingCardUpgraded.cardId,
};
