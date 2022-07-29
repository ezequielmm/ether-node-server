import { imbued } from 'src/game/status/imbued/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const TightenGripCard: Card = {
    cardId: 111,
    name: 'Tighten Grip',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Play your next card twice`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: imbued.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: Number.NaN,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const TightenGripCardUpgraded: Card = {
    cardId: 112,
    name: 'Tighten Grip+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Play your next card twice`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: imbued.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: Number.NaN,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
