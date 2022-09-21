import { doubleDown } from 'src/game/status/doubleDown/contants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const DoubleDownCard: Card = {
    cardId: 113,
    name: 'Double Down',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Your next attack this turn does double damage`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: doubleDown.name,
                args: { attachTo: CardTargetedEnum.Player, counter: 2 },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const DoubleDownCardUpgraded: Card = {
    cardId: 114,
    name: 'Double Down+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Your next attack this turn does triple damage`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: doubleDown.name,
                args: { attachTo: CardTargetedEnum.Player, counter: 3 },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
