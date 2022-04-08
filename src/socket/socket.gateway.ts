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
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ExpeditionService } from 'src/expedition/expedition.service';
import { SocketClientService } from 'src/socketClient/socketClient.service';

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
        private readonly authGatewayService: AuthGatewayService,
        private readonly socketClientService: SocketClientService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async afterInit(): Promise<void> {
        this.socketClientService.clearClients();
        this.logger.log(`Socket Initiated`);
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client attempting a connection: ${client.id}`);
        const { authorization } = client.handshake.headers;

        if (!authorization) {
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }

        try {
            const { data } = await this.authGatewayService.getUser(
                authorization,
            );
            const { id } = data.data;

            await this.socketClientService.create({
                player_id: id,
                client_id: client.id,
            });

            this.logger.log(`Client connected: ${client.id}`);

            const { map, player_state } =
                await this.expeditionService.getExpeditionByPlayerId(id);

            client.emit('ExpeditionMap', JSON.stringify(map));
            client.emit('PlayerState', JSON.stringify(player_state));
        } catch (e) {
            this.logger.log(e.message);
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket): Promise<void> {
        await this.socketClientService.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        const { player_id } =
            await this.socketClientService.getSocketClientPlayerIdByClientId(
                client.id,
            );

        const { map, player_state } =
            await this.expeditionService.getExpeditionByPlayerId(player_id);

        client.emit('ExpeditionMap', JSON.stringify(map));
        client.emit('PlayerState', JSON.stringify(player_state));
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: string): Promise<string> {
        client.emit('NodeSelected', node_id);
        this.logger.log(`Node id: ${node_id}`);
        return `Node id: ${node_id}`;
    }
}
