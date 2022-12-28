import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

export interface IMoveCard {
    cardToTake: string;
}

@WebSocketGateway(corsSocketSettings)
export class MoveCardGateway {}
