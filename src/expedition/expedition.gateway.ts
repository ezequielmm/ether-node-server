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
import { v4 as uuidv4 } from 'uuid';

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

    @SubscribeMessage('selectNode')
    async handleSelectNode(
        client: Socket,
        payload: { expedition_id: string; player_id: string; node_id: string },
    ): Promise<void> {
        const { expedition_id, player_id, node_id } = payload;
        if (
            await this.service.expeditionBelongsToPlayer(
                player_id,
                expedition_id,
            )
        ) {
            // TODO: actual implementation
            const node = {
                id: uuidv4(),
                name: 'Test',
                description: '',
                created_at: '',
                type: 'combat',
                node_enemies: [],
            };
            this.server.to(expedition_id).emit('selectedNode', {
                status: 'node_selected',
                expedition_id,
                node,
            });
        } else {
            this.server.emit('unknownExpedition', {
                status: 'unknown_room',
                expedition_id,
            });
        }
    }
}
