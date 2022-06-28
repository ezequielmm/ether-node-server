import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger, UseFilters } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomExceptionFilter } from 'src/socket/customException.filter';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseFilters(CustomExceptionFilter)
export class ExpeditionGateway {
    private readonly logger: Logger = new Logger(ExpeditionGateway.name);

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        this.logger.log(`Client ${client.id} trigger message "SyncExpedition"`);
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "NodeSelected": ${node_id}`,
        );

        console.log(node_id);

        return '';
    }
}
