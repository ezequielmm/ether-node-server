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
export class MockedServerSocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(
        MockedServerSocketGateway.name,
    );

    @WebSocketServer() server: Server;
    clientSocket: Socket;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    afterInit(): void {
        this.logger.debug('socket initialized');
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.debug(`handling connection with client id ${client.id}`);
        this.clientSocket = client;
    }

    async handleDisconnect(client: Socket): Promise<void> {
        this.logger.debug(`handling disconnect with client id ${client.id}`);
        client.disconnect();
    }
}
