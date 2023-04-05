import { imbued } from 'src/game/status/imbued/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

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
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: null,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

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
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: null,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: TightenGripCardUpgraded.cardId,
    isActive: true,
};
