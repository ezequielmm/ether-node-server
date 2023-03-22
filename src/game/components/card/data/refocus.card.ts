import { removeDebuff } from 'src/game/effects/removeDebuff/contants';
import { resist } from 'src/game/status/resist/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardEnergyEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const RefocusCardUpgraded: Card = {
    cardId: 158,
    name: 'Re-focus+',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Remove all debuffs\nGain X Resist`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: removeDebuff.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: Number.NaN, // non finite number will remove all debuffs
                },
            },
        ],
        statuses: [
            {
                name: resist.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                    counterDynamic: 'playerEnergy',
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    isActive: true,
};

export const RefocusCard: Card = {
    cardId: 157,
    name: 'Re-focus',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Remove 1 debuff\nGain X Resist`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: removeDebuff.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                },
            },
        ],
        statuses: [
            {
                name: resist.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                    counterDynamic: 'playerEnergy',
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    isActive: true,
};
