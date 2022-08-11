import { removeDebuff } from 'src/game/effects/removeDebuff/contants';
import { resist } from 'src/game/status/resist/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const Refocus: Card = {
    cardId: 157,
    name: 'Re-focus',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: -1,
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
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const RefocusUpgraded: Card = {
    cardId: 158,
    name: 'Re-focus',
    rarity: CardRarityEnum.Legendary,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: -1,
    description: `Remove all debuffs\nGain X Resist`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: removeDebuff.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: Number.POSITIVE_INFINITY,
                },
            },
        ],
        statuses: [
            {
                name: resist.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
