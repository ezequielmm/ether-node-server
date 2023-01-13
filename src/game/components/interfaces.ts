import { ModuleRef } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { ExpeditionEnemy } from './enemy/enemy.interface';
import { ExpeditionDocument } from './expedition/expedition.schema';
import { ExpeditionPlayer } from './player/interfaces';

export interface GameContext {
    readonly client: Socket;
    readonly expedition: ExpeditionDocument;
    readonly events: EventEmitter2;
    readonly moduleRef: ModuleRef;
}

export type ExpeditionEntity = ExpeditionPlayer | ExpeditionEnemy;
