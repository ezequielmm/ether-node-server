import { ModuleRef } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { ExpeditionEnemy } from './enemy/enemy.interface';
import { ExpeditionDocument } from './expedition/expedition.schema';
import { ExpeditionPlayer } from './player/interfaces';
import { MapDocument } from './expedition/map.schema';

export interface GameContext {
    readonly client: Socket;
    readonly expedition: ExpeditionDocument;
    readonly map: MapDocument;
    readonly events: EventEmitter2;
    readonly moduleRef: ModuleRef;
    readonly info: {
        account: string;
        expeditionId: string;
        env: string;
        service: string;
    };
}

export type ExpeditionEntity = ExpeditionPlayer | ExpeditionEnemy;
