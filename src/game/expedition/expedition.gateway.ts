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
        await new FullSyncAction().handle(client);
        this.logger.log(`Sending "SyncExpedition" to client ${client.id}`);
    }
}
