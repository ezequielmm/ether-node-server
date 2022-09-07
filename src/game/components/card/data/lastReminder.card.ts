import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { regeneration } from 'src/game/status/regeneration/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const lastReminderCard: Card = {
    cardId: 153,
    name: 'Last Reminder',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} damage.\n Gain {${defenseEffect.name}} defense.\n If the enemy has Burn,  gain {${regeneration.name}} Regenerate`,
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
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 7,
                },
            },
        ],
        statuses: [
            {
                name: regeneration.name,
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Self,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

export const LastReminderCardUpgraded: Card = {
    cardId: 148,
    name: 'Last Reminder+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal {${damageEffect.name}} damage.\n Gain {${defenseEffect.name}} defense.\n If the enemy has Burn,  gain {${regeneration.name}} Regenerate`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 11,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 11,
                },
            },
        ],
        statuses: [
            {
                name: regeneration.name,
                args: {
                    value: 2,
                    attachTo: CardTargetedEnum.Self,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};
