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

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    private readonly logger: Logger = new Logger(SocketGateway.name);

    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async afterInit(): Promise<void> {
        this.logger.log(`Socket Initiated`);
    }

    //#region handleConnection
    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client attempting a connection: ${client.id}`);
        const { authorization } = client.handshake.headers;

        if (!authorization) {
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }

        try {
            const {
                data: {
                    data: { id: player_id },
                },
            } = await this.authGatewayService.getUser(authorization);

            const { map, player_state } =
                await this.expeditionService.updateExpeditionInProgressByPlayerId(
                    player_id,
                    {
                        client_id: client.id,
                    },
                );

            client.emit('ExpeditionMap', JSON.stringify({ data: map }));
            client.emit('PlayerState', JSON.stringify({ data: player_state }));

            this.logger.log(`Client connected: ${client.id}`);
        } catch (e) {
            this.logger.log(e.message);
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }
    }
    //#endregion

    //#region handleDisconnect
    async handleDisconnect(client: Socket): Promise<void> {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    //#endregion

    //#region handleSyncExpedition
    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        const { map, player_state } =
            await this.expeditionService.getActiveExpeditionByClientId(
                client.id,
            );

        client.emit('ExpeditionMap', JSON.stringify({ data: map }));
        client.emit('PlayerState', JSON.stringify({ data: player_state }));
    }
    //#endregion
}
