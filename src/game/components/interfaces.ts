import { Socket } from 'socket.io';
import { ExpeditionEnemy } from './enemy/enemy.interface';
import { ExpeditionDocument } from './expedition/expedition.schema';
import { ExpeditionPlayer } from './player/interfaces';

export interface Context {
    readonly client: Socket;
    readonly expedition: ExpeditionDocument;
}

export type ExpeditionEntity = ExpeditionPlayer | ExpeditionEnemy;
