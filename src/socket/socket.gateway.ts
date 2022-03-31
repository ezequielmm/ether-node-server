import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
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
    private logger: Logger = new Logger('ExpeditionGateway');

    constructor(
        private readonly socketService: SocketService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    afterInit() {
        this.logger.log(`Socket initiated`);
    }

    async handleConnection(
        @ConnectedSocket() client: Socket,
    ): Promise<unknown> {
        this.logger.log(`Client connected: ${client.id}`);
        const { authorization } = client.handshake.headers;
        const { request } = await this.socketService.getUser(authorization);
        const { res } = request;
        const { statusCode } = res;

        if (parseInt(statusCode) !== 200) return client.disconnect(true);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('CreateExpedition')
    async handleCreateExpedition(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: string,
    ): Promise<void> {
        const payload: CreateExpedition = JSON.parse(data);
        const { player_id } = payload;

        await this.expeditionService.updateActiveExpeditionByPlayerId(
            player_id,
            { status: ExpeditionStatus.Canceled },
        );

        const { _id: expeditionId } =
            await this.expeditionService.createExpedition_V1({
                player_id,
            });

        client.rooms.add(expeditionId);
        this.logger.log(
            `Client ${client.id} was added to expedition ${expeditionId}`,
        );
    }

    @SubscribeMessage('ContinueExpedition')
    async handleContinueExpedition(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: string,
    ): Promise<void> {
        const payload: CreateExpedition = JSON.parse(data);
        const { player_id } = payload;

        const { _id: expeditionId } =
            await this.expeditionService.getExpeditionByPlayerId(player_id);

        client.rooms.add(expeditionId);
        this.logger.log(
            `Client ${client.id} was added to expedition ${expeditionId}`,
        );
    }
}
