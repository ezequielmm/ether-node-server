import { initialCard } from 'src/game/status/initialCard/constants';
import { turtling } from 'src/game/status/turtling/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const GmCard: Card = {
    cardId: 117,
    name: 'GM',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 0,
    description: `At the end of this turn, double your defense`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: initialCard.name,
                args: {
                    value: 1,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
};

export const GmCardUpgraded: Card = {
    cardId: 178,
    name: 'Turtle+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 0,
    description: `At the end of next turn, double your defense`,
    keywords: [],
    properties: {
        effects: [],
        statuses: [
            {
                name: turtling.name,
                args: {
                    value: 2,
                    attachTo: CardTargetedEnum.Player,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
};
