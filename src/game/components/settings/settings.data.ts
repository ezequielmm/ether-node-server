import { CardTypeEnum } from '../card/card.enum';
import { Settings } from './settings.schema';

export const settingsData: Settings = {
    player: {
        energy: {
            initial: 3,
            max: 3,
        },
        handSize: 5,
        deckSize: 10,
        deckSettings: [
            {
                cardType: CardTypeEnum.Attack,
                args: { cardsToTake: 4, takeUpgrades: false },
            },
            {
                cardType: CardTypeEnum.Defend,
                args: { cardsToTake: 3, takeUpgrades: false },
            },
            {
                cardType: CardTypeEnum.Skill,
                args: { cardsToTake: 3, takeUpgrades: false },
            },
        ],
    },
};
