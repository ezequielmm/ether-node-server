import { regeneration } from 'src/game/status/regeneration/contants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const InvokeBlessingCardUpgraded: Card = {
    cardId: 80,
    name: 'Invoke Blessing+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 0,
    description: `Gain {${regeneration.name}} Regeneration`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: regeneration.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const InvokeBlessingCard: Card = {
    cardId: 79,
    name: 'Invoke Blessing',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 1,
    description: `Gain {${regeneration.name}} Regeneration`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: regeneration.name,
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
    isActive: true,
};