import { burn } from 'src/game/status/burn/constants';
import { enflamed } from 'src/game/status/enflamed/contants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const EnflameCard: Card = {
    cardId: 17,
    name: 'enflame',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 2,
    description: `First Attack each turn will Apply {${burn.name}} Burn.\nExhaust`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: enflamed.name,
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: true,
    isUpgraded: false,
};

export const EnflameCardUpgraded: Card = {
    cardId: 18,
    name: 'enflame+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Power,
    pool: 'knight',
    energy: 2,
    description: `First Attack each turn will Apply {${burn.name}} Burn.\nExhaust`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
};
