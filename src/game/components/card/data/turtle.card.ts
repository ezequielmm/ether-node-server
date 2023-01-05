import { turtling } from 'src/game/status/turtling/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const TurtleCardUpgraded: Card = {
    cardId: 16,
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
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 2,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: false,
};

export const TurtleCard: Card = {
    cardId: 15,
    name: 'Turtle',
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
                name: turtling.name,
                attachTo: CardTargetedEnum.Player,
                args: {
                    counter: 1,
                },
            },
        ],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: TurtleCardUpgraded.cardId,
    isActive: false,
};
