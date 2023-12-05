import { comebackStatus } from 'src/game/status/comeback/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { defenseEffect } from 'src/game/effects/defense/constants';

export const VengefulStrikeCardUpgraded: Card = {
    cardId: 567,
    name: 'Vengeful Strike+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain 1 comeback. Gain 8 ${defenseEffect.name}.`,
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
        ],
        statuses: [{
            name: comebackStatus.name,
            attachTo: CardTargetedEnum.Player,
            args: {
                counter: 1,

            },
        },],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const VengefulStrikeCard: Card = {
    cardId: 566,
    name: 'Vengeful Strike',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain 1 comeback. Gain 5 ${defenseEffect.name}`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 5,
                },
            },
        ],
        statuses: [
            {
                name: comebackStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: VengefulStrikeCardUpgraded.cardId,
    isActive: true,
};
