import { CardSelectionScreen } from './cardSelectionScreen.schema';

export type CreateCardSelectionScreenDTO = CardSelectionScreen;

export interface IFindCardSelectionScreenDTO {
    readonly clientId: string;
}

export interface UpdateCardSelectionScreenDTO {
    readonly clientId: string;
    readonly cardIds?: string[];
    takenCards?: number;
}
