import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { NodeSelectedProcess } from 'src/game/process/nodeSelected.process';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { corsSocketSettings } from './socket.enum';
import { ContinueExpeditionProcess } from 'src/game/process/continueExpedition.process';

@WebSocketGateway(corsSocketSettings)
export class ExpeditionGateway {
    private readonly logger: Logger = new Logger(ExpeditionGateway.name);

    constructor(
        private readonly nodeSelectedProcess: NodeSelectedProcess,
        private readonly fullSyncAction: FullSyncAction,
        private readonly expeditionService: ExpeditionService,
        private readonly continueExpeditionProcess: ContinueExpeditionProcess,
    ) {}

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "SyncExpedition"`,
        );

        await this.fullSyncAction.handle(client);
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        this.logger.debug(
            `Client ${client.id} trigger message "NodeSelected": ${node_id}`,
        );

        const ctx = await this.expeditionService.getGameContext(client);

        try {
            return await this.nodeSelectedProcess.handle(ctx, node_id);
        } catch (e) {
            this.logger.error(e.message);
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: `An Error has ocurred selecting the node`,
            });
        }
    }

    @SubscribeMessage('ContinueExpedition')
    async handleContinueExpedition(client: Socket): Promise<string> {
        this.logger.debug(`Client ${client.id} will advance to the next node`);
        const ctx = await this.expeditionService.getGameContext(client);

        return this.continueExpeditionProcess.handle(ctx);
    }

    @SubscribeMessage('NodeSkipped')
    async handleNodeSkipped(client: Socket, node_id: number): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);

        this.logger.debug(
            `Client ${client.id} trigger message "NodeSkipped": ${node_id}`,
        );

        await this.expeditionService.overrideAvailableNode({
            ctx,
            nodeId: node_id,
        });
    }
}
