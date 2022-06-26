import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { isValidAuthToken } from '../utils';
import { ExpeditionService } from '../game/components/expedition/expedition.service';
import { FullSyncAction } from '../game/expedition/actions/fullSync.action';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(SocketGateway.name);

    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
        private readonly fullSyncAction: FullSyncAction,
    ) {}

    afterInit(): void {
        this.logger.log(`Socket Initiated`);
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client attempting a connection: ${client.id}`);
        const { authorization } = client.handshake.headers;

        if (!isValidAuthToken(authorization)) {
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }

        try {
            const {
                data: {
                    data: { id: player_id },
                },
            } = await this.authGatewayService.getUser(authorization);

            const expeditionExists =
                await this.expeditionService.playerHasExpeditionInProgress(
                    player_id,
                );

            if (expeditionExists) {
                await this.expeditionService.updateClientId({
                    player_id,
                    client_id: client.id,
                });

                await this.fullSyncAction.handle(client);

                this.logger.log(`Client connected: ${client.id}`);
            } else {
                this.logger.error(
                    `There is no expedition in progress for this player: ${client.id}`,
                );
                client.disconnect(true);
            }
        } catch (e) {
            this.logger.log(e.message);
            this.logger.log(e.stack);
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}
