import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { lastReminderEffect } from 'src/game/effects/lastReminder/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const LastReminderCardUpgraded: Card = {
    cardId: 154,
    name: 'Last Reminder+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal 7 damage, Gain 7 defense, If the enemy has Burn, gain 1 Regeneration`,
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
            {
                effect: lastReminderEffect.name,
                target: CardTargetedEnum.Enemy,
                args: { value: 2 },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const LastReminderCard: Card = {
    cardId: 153,
    name: 'Last Reminder',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 1,
    description: `Deal 11 damage, Gain 11 defense, If the enemy has Burn, gain 2 Regeneration`,
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
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 11,
                },
            },
            {
                effect: lastReminderEffect.name,
                target: CardTargetedEnum.Enemy,
                args: { value: 1 },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: LastReminderCardUpgraded.cardId,
    isActive: true,
};