import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
    sendErrorMessage(message: string, client: Socket): void {
        client.emit('ErrorMessage', { message });
    }
}
