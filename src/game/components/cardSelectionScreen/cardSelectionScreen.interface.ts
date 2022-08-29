import { CardSelectionScreen } from './cardSelectionScreen.schema';

export type CreateCardSelectionScreenDTO = CardSelectionScreen;

export interface IFindCardSelectionScreen {
    readonly client_id?: string;
    readonly id?: string;
}
