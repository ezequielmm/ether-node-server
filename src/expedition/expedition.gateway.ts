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
    namespace: '/v1/socket/expeditions',
})
export class ExpeditionGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ExpeditionGateway');

    afterInit() {
        this.logger.log(`Socket initiated on port`);
    }

    handleDisconnect({ id }: Socket) {
        this.logger.log(`Client disconnected: ${id}`);
    }

    handleConnection({ id }: Socket) {
        this.logger.log(`Client connected: ${id}`);
    }

    @SubscribeMessage('joinExpedition')
    handleJoinExpedition(client: Socket, room: string) {
        client.join(room);
    }
}
