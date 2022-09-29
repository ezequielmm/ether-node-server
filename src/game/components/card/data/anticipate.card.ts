import { anticipatingEffect } from 'src/game/effects/anticipating/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const AnticipateCardUpgraded: Card = {
    cardId: 60,
    name: 'Anticipate+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain {${defenseEffect.name}} Defense. \nDefense carries over to next turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 8,
                },
            },
            {
                effect: anticipatingEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: Number.NaN,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const AnticipateCard: Card = {
    cardId: 59,
    name: 'Anticipate',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 2,
    description: `Gain {${defenseEffect.name}} Defense. \nDefense carries over to next turn.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 8,
                },
            },
            {
                effect: anticipatingEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: Number.NaN,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: AnticipateCardUpgraded.cardId,
};
