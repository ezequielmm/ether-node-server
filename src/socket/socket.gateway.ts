import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway(7777, {
    cors: {
        origin: '*',
    },
    namespace: '/socket',
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger(SocketGateway.name);

    constructor(private readonly socketService: SocketService) {}

    afterInit() {
        this.logger.log(`Socket initiated`);
    }

    async handleConnection(client: Socket): Promise<unknown> {
        this.logger.log(`Client attempting a connection: ${client.id}`);
        const { authorization } = client.handshake.headers;
        const { request } = await this.socketService.getUser(authorization);
        const { res } = request;
        const { statusCode } = res;

        if (parseInt(statusCode) !== 200) {
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            return client.disconnect(true);
        }

        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}
