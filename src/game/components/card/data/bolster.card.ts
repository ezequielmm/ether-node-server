import { bolstered } from 'src/game/status/bolstered/constants';
import { CardRarityEnum, CardTargetedEnum, CardTypeEnum } from '../card.enum';
import { Card } from '../card.schema';

export const BolsterCard: Card = {
    cardId: 47,
    name: 'Bolster',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 0,
    description: `Gain {${bolstered.name}} defense for each card played this turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: bolstered.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const BolsterCardUpgraded: Card = {
    cardId: 48,
    name: 'Bolster',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 0,
    description: `Gain {${bolstered.name}} defense for each card played this turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: bolstered.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 3,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
