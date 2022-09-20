import {
    tasteOfBloodBuff,
    tasteOfBloodDebuff,
} from 'src/game/status/tasteOfBlood/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const TasteOfBloodCard: Card = {
    cardId: 105,
    name: 'Taste of Blood',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 2,
    description:
        'Take double damage and deal double damage for the next 2 turns.',
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: tasteOfBloodBuff.name,
                args: {
                    counter: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
            {
                name: tasteOfBloodDebuff.name,
                args: {
                    counter: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const TasteOfBloodCardUpgraded: Card = {
    cardId: 106,
    name: 'Taste of Blood+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description:
        'Take double damage and deal double damage for the next 2 turns.',
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: tasteOfBloodBuff.name,
                args: {
                    counter: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
            {
                name: tasteOfBloodDebuff.name,
                args: {
                    counter: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
