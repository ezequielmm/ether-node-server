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
import { ExpeditionStatus } from 'src/expedition/expedition.schema';
import { ExpeditionService } from 'src/expedition/expedition.service';
import { SocketClientService } from 'src/socketClient/socketClient.service';
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
    private readonly logger: Logger = new Logger(SocketGateway.name);

    constructor(
        private readonly socketService: SocketService,
        private readonly expeditionService: ExpeditionService,
        private readonly socketClientService: SocketClientService,
    ) {}

    async afterInit() {
        this.logger.log(`Socket initiated`);
        await this.socketClientService.clearClients();
    }

    async handleConnection(client: Socket): Promise<unknown> {
        this.logger.log(`Client attempting a connection: ${client.id}`);
        const { authorization } = client.handshake.headers;

        try {
            const { data } = await this.socketService.getUser(authorization);
            const { id } = data.data;

            await this.socketClientService.create({
                player_id: id,
                client_id: client.id,
            });

            this.logger.log(`Client connected: ${client.id}`);
        } catch (e) {
            this.logger.log(e.message);
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            return client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket) {
        await this.socketClientService.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('CreateExpedition')
    async handleCreateExpedition(client: Socket): Promise<void> {
        const { player_id } = await this.socketClientService.getByClientId(
            client.id,
        );

        await this.expeditionService.updateActiveExpeditionByPlayerId(
            player_id,
            { status: ExpeditionStatus.Canceled },
        );

        const { map } = await this.expeditionService.createExpedition_V1({
            player_id,
        });

        client.emit('ExpeditionStarted', JSON.stringify(map));
    }

    @SubscribeMessage('ContinueExpedition')
    async handleContinueExpedition(client: Socket): Promise<void> {
        const { player_id } = await this.socketClientService.getByClientId(
            client.id,
        );

        try {
            const { map } =
                await this.expeditionService.getExpeditionByPlayerId(player_id);

            client.emit('ExpeditionStarted', JSON.stringify(map));
        } catch (e) {
            this.socketService.sendErrorMessage(
                'There is no expedition for this player',
                client,
            );
        }
    }
}
