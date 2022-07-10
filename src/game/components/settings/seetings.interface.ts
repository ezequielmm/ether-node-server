import { CardTypeEnum } from '../card/card.enum';

export interface DeckSettings {
    typesAllowed: CardTypeEnum[];
    takeUpgrades: boolean;
    deckSize: number;
}
