import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(SocketGateway.name);

    afterInit(): void {
        this.logger.log(`Socket Initiated`);
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client attempting a connection: ${client.id}`);
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}
