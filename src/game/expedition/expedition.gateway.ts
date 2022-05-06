import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { FullSyncAction } from './action/fullSync.action';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ExpeditionGateway {
    private readonly logger: Logger = new Logger(ExpeditionGateway.name);

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        this.logger.log(`Client ${client.id} trigger message "SyncExpedition"`);
        await new FullSyncAction().handle(client);
        this.logger.log(`Sending "ExpeditionMap" to client ${client.id}`);
        this.logger.log(`Sending "PlayerState" to client ${client.id}`);
    }
}
