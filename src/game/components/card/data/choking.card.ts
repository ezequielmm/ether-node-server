import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import {
    CardKeywordEnum,
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const ChokingCard: Card = {
    cardId: 506,
    name: 'Choking',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Status,
    pool: 'knight',
    energy: 1,
    description: 'Gain 2 Feeble if in hand at end of turn.\nExhaust',
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    triggerAtEndOfTurn: {
        effects: [
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    statusName: feebleStatus.name,
                    statusArgs: {
                        counter: 2,
                    },
                },
            },
        ],
        statuses: [],
    },
    isActive: true,
};
