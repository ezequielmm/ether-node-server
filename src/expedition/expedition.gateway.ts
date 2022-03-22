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
import { ExpeditionService } from './expedition.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/v1/expeditions/socket',
})
export class ExpeditionGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly service: ExpeditionService) {}
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ExpeditionGateway');

    afterInit() {
        this.logger.log(`Socket initiated`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        client.rooms.forEach((room) => this.logger.log(room));
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        client.rooms.forEach((room) => this.logger.log(room));
    }

    @SubscribeMessage('joinExpedition')
    async handleJoinExpedition(
        client: Socket,
        payload: { player_id: string; expedition_id: string },
    ): Promise<void> {
        const { player_id, expedition_id } = payload;
        if (
            await this.service.expeditionBelongsToPlayer(
                player_id,
                expedition_id,
            )
        ) {
            client.join(expedition_id);
            this.server.to(expedition_id).emit('joinedExpedition', {
                status: 'room_created',
                expedition_id,
            });
        } else {
            this.server.emit('unknownExpedition', {
                status: 'unknown_room',
                expedition_id,
            });
        }
    }
    @SubscribeMessage('CombatStatus')
    async getCombatStatus(
        client: Socket,
        payload: {
            expedition_id: string;
            player_id: string;
            combat_id: string;
        },
    ): Promise<void> {
        const { expedition_id, player_id, combat_id } = payload;
        if (
            await this.service.expeditionBelongsToPlayer(
                player_id,
                expedition_id,
            )
        ) {
            // TODO: check if combat belongs to player once combat definition is defined

            const combat = {
                status: 'in_progress',
                combat_id,
            };

            this.server.to(expedition_id).emit('CombatStatus', {
                status: 'combat_status',
                expedition_id,
                combat,
            });
        } else {
            this.server.emit('unknownExpedition', {
                status: 'unknown_room',
                expedition_id,
            });
        }
    }
}
