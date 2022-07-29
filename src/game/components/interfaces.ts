import { Socket } from 'socket.io';
import { ExpeditionDocument } from './expedition/expedition.schema';

export interface Context {
    readonly client: Socket;
    readonly expedition: ExpeditionDocument;
}
