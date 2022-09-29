import { heraldDelayedStatus } from 'src/game/status/heraldDelayed/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';



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
                name: heraldDelayedStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: Number.NaN,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};

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
                name: heraldDelayedStatus.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: Number.NaN,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: HeraldOfPainCardUpgraded.cardId,
};
