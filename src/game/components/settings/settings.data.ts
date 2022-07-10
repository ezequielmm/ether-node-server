import { CardTypeEnum } from '../card/card.enum';
import { Settings } from './settings.schema';

export const settingsData: Settings = {
    player: {
        energy: {
            initial: 3,
            max: 3,
        },
        handSize: 5,
        deckSettings: {
            typesAllowed: [
                CardTypeEnum.Attack,
                CardTypeEnum.Defend,
                CardTypeEnum.Skill,
            ],
            takeUpgrades: false,
            deckSize: 10,
        },
    },
};
