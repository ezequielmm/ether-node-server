import { corsSocketSettings } from 'src/socket/socket.enum';
import {
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(corsSocketSettings)
export class ServerSocketGatewayMock
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(ServerSocketGatewayMock.name);

    @WebSocketServer() server: Server;
    clientSocket: Socket;

    afterInit(): void {
        this.logger.log('socket initialized');
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`handling connection with client id ${client.id}`);
        this.clientSocket = client;
    }

    async handleDisconnect(client: Socket): Promise<void> {
        this.logger.log(`handling disconnect with client id ${client.id}`);
        client.disconnect();
    }
}
