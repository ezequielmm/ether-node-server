import { CardTypeEnum } from '../card/card.enum';

export interface DeckSettings {
    cardType: CardTypeEnum;
    args: {
        cardsToTake: number;
        takeUpgrades: boolean;
    };
}
