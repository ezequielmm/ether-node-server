import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger, UseFilters } from '@nestjs/common';
import { Socket } from 'socket.io';
import { FullSyncAction } from './actions/fullSync.action';
import { NodeSelectedAction } from './actions/nodeSelected.action';
import { CustomExceptionFilter } from 'src/socket/customException.filter';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseFilters(CustomExceptionFilter)
export class ExpeditionGateway {
    private readonly logger: Logger = new Logger(ExpeditionGateway.name);

    constructor(
        private readonly fullSyncAction: FullSyncAction,
        private readonly nodeSelectedAction: NodeSelectedAction,
    ) {}

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<string> {
        this.logger.log(`Client ${client.id} trigger message "SyncExpedition"`);

        try {
            return await this.fullSyncAction.handle(client);
        } catch (e) {
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: 'An error has ocurred syncing the expedition',
            });
        }
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "NodeSelected": ${node_id}`,
        );

        try {
            return await this.nodeSelectedAction.handle(client, node_id);
        } catch (e) {
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: 'An error has ocurred selecting a node',
            });
        }
    }
}
