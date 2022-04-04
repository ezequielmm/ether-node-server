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
import { CheckCombatStatus } from 'src/interfaces/combatStatus.interface';
import { CreateExpedition } from 'src/interfaces/CreateExpedition.interface';
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
    ) {}

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

    @SubscribeMessage('CreateExpedition')
    async handleCreateExpedition(client: Socket, data: string): Promise<void> {
        const payload: CreateExpedition = JSON.parse(data);

        const { player_id } = payload;

        await this.expeditionService.updateActiveExpeditionByPlayerId(
            player_id,
            { status: ExpeditionStatus.Canceled },
        );

        const { _id: expeditionId, map } =
            await this.expeditionService.createExpedition_V1({
                player_id,
            });

        client.rooms.add(expeditionId);

        this.logger.log(
            `Client ${client.id} was added to expedition ${expeditionId}`,
        );

        client.emit('ExpeditionStarted', JSON.stringify(map));
    }

    @SubscribeMessage('ContinueExpedition')
    async handleContinueExpedition(
        client: Socket,
        data: string,
    ): Promise<void> {
        const payload: CreateExpedition = JSON.parse(data);
        const { player_id } = payload;

        const { _id: expeditionId, map } =
            await this.expeditionService.getExpeditionByPlayerId(player_id);

        client.rooms.add(expeditionId);

        this.logger.log(
            `Client ${client.id} was added to expedition ${expeditionId}`,
        );

        client.emit('ExpeditionStarted', JSON.stringify(map));
    }

    @SubscribeMessage('CheckCombatStatus')
    async handleCheckCombatStatus(client: Socket, data: string): Promise<void> {
        const payload: CheckCombatStatus = JSON.parse(data);
        const { expedition_id, player_id, combat_id } = payload;

        if (
            await this.expeditionService.expeditionBelongsToPlayer(
                player_id,
                expedition_id,
            )
        ) {
            // TODO: check if combat belongs to player once combat definition is defined
            const combat = {
                status: 'in_progress',
                combat_id,
            };

            client.emit('CombatStatus', {
                status: 'combat_status',
                expedition_id,
                combat,
            });
        } else {
            client.emit('unknownExpedition', {
                status: 'unknown_room',
                expedition_id,
            });
        }
    }
}
