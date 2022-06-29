import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { NodeSelectedProcess } from 'src/game/process/nodeSelected.process';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ExpeditionGateway {
    private readonly logger: Logger = new Logger(ExpeditionGateway.name);

    constructor(private readonly nodeSelectedProcess: NodeSelectedProcess) {}

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        this.logger.log(`Client ${client.id} trigger message "SyncExpedition"`);
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "NodeSelected": ${node_id}`,
        );

        try {
            return await this.nodeSelectedProcess.handle(client, node_id);
        } catch (e) {
            this.logger.error(e.message);
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: `${client.id} error has ocurred selecting the node ${node_id}`,
            });
        }
    }
}
