import { heraldDelayed } from 'src/game/status/heraldDelayed/constants';
import { nextPlayerTurnStatus } from 'src/game/status/nextPlayerTurn/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const HeraldOfPainCard: Card = {
    cardId: 95,
    name: 'Herald of Pain',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 1,
    description: `Double all damage dealt next turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: nextPlayerTurnStatus.name,
                args: {
                    value: Number.NaN,
                    attachTo: CardTargetedEnum.Player,
                    statusName: heraldDelayed.name,
                    statusArgs: {
                        value: 1,
                    },
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const HeraldOfPainCardUpgraded: Card = {
    cardId: 96,
    name: 'Herald of Pain+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Skill,
    pool: 'knight',
    energy: 0,
    description: `Double all damage dealt next turn.`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: nextPlayerTurnStatus.name,
                args: {
                    value: Number.NaN,
                    attachTo: CardTargetedEnum.Player,
                    statusName: heraldDelayed.name,
                    statusArgs: {
                        value: 1,
                    },
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
