import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExpeditionService } from 'src/expedition/expedition.service';
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
    private logger: Logger = new Logger('ExpeditionGateway');

    constructor(
        private readonly socketService: SocketService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    afterInit() {
        this.logger.log(`Socket initiated`);
    }

    async handleConnection(@ConnectedSocket() client: Socket): Promise<any> {
        this.logger.log(`Client connected: ${client.id}`);
        const { authorization } = client.handshake.headers;
        const { request, data } = await this.socketService.getUser(
            authorization,
        );
        const { res } = request;
        const { statusCode } = res;

        if (parseInt(statusCode) !== 200) return client.disconnect(true);

        const { data: profile } = data;

        const status =
            await this.expeditionService.getExpeditionStatusByPlayedId(
                profile.id,
            );

        client.emit('ReceiveExpeditionStatus', { status, client: client.id });

        return { status, client: client.id };
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('SendExpeditionStatus')
    handleSendExpeditionStatus(socket: Server): void {
        socket.emit('ReceiveExpeditionStatus', {
            data: 'test',
        });
    }
}
