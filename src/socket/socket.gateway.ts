import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Profile } from 'src/interfaces/ProfileInterface';
import { SocketService } from './socket.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/socket',
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ExpeditionGateway');

    constructor(private readonly socketService: SocketService) {}

    afterInit() {
        this.logger.log(`Socket initiated`);
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        const { authorization } = client.handshake.headers;
    }
}
