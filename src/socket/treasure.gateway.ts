import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class TreasureGateway {
    private readonly logger: Logger = new Logger(TreasureGateway.name);

    @SubscribeMessage('ChestOpened')
    async handleChestOpened(client: Socket): Promise<void> {
        this.logger.debug(`Client ${client.id} trigger message "ChestOpened"`);
    }
}
