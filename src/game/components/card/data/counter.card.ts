import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';

export const CounterCardUpgraded: Card = {
    cardId: 8,
    name: 'Counter+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} Damage, Gain {${defenseEffect.name}} Defense`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 7,
                },
            },
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 7,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const CounterCard: Card = {
    cardId: 7,
    name: 'Counter',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} + {${resolveStatus.name}} Damage, Gain {${defenseEffect.name}} Defense`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 4,
                },
            },
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 4,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: CounterCardUpgraded.cardId,
    isActive: true,
};
