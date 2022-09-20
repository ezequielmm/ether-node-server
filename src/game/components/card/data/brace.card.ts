import { defenseEffect } from 'src/game/effects/defense/constants';
import { resolve } from 'src/game/status/resolve/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BraceCard: Card = {
    cardId: 5,
    name: 'Brace',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 2,
    description: `Gain 8 Defense and 1 Resolve`,
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
        statuses: [
            {
                name: resolve.name,
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

export const BraceCardUpgraded: Card = {
    cardId: 6,
    name: 'Brace+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 2,
    description: `Gain 11 Defense`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 11,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
};
