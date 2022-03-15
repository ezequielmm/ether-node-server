import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('SocketGateway');

    afterInit() {
        this.logger.log(`Socket server initiated`);
    }

    handleConnection({ id }: Socket) {
        this.logger.log(`Client connected: ${id}`);
    }

    handleDisconnect({ id }: Socket) {
        this.logger.log(`Client disconnected: ${id}`);
    }

    @SubscribeMessage('msgToServer')
    handleMessage({ id }: Socket, payload: string): void {
        console.log(`${id}: ${payload}`);
        this.server.emit('msgToClient', payload);
    }
}
