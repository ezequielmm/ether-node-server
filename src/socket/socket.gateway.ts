import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExpeditionService } from 'src/expedition/expedition.service';
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

    constructor(
        private readonly socketService: SocketService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    afterInit() {
        this.logger.log(`Socket initiated`);
    }

    async handleConnection(client: Socket): Promise<unknown> {
        this.logger.log(`Client connected: ${client.id}`);
        const { authorization } = client.handshake.headers;
        const { request, data } = await this.socketService.getUser(
            authorization,
        );
        const { res } = request;
        const { statusCode } = res;

        if (statusCode !== 200) return client.disconnect();

        const { data: profile } = data;

        const status =
            await this.expeditionService.getExpeditionStatusByPlayedId(
                profile.id,
            );

        client.emit('expeditionStatus', { status });
    }
}
