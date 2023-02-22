import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { NodeSelectedProcess } from 'src/game/process/nodeSelected.process';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { corsSocketSettings } from './socket.enum';
import { ContinueExpeditionProcess } from 'src/game/process/continueExpedition.process';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@WebSocketGateway(corsSocketSettings)
export class ExpeditionGateway {
    constructor(
        @InjectPinoLogger(ExpeditionGateway.name)
        private readonly logger: PinoLogger,
        private readonly nodeSelectedProcess: NodeSelectedProcess,
        private readonly fullSyncAction: FullSyncAction,
        private readonly expeditionService: ExpeditionService,
        private readonly continueExpeditionProcess: ContinueExpeditionProcess,
    ) {}

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);
        this.logger.info(
            ctx.info,
            `Client ${client.id} trigger message "SyncExpedition"`,
        );

        await this.fullSyncAction.handle(client);
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        const ctx = await this.expeditionService.getGameContext(client);
        const logger = this.logger.logger.child(ctx.info);

        logger.info(
            ctx.info,
            `Client ${client.id} trigger message "NodeSelected": ${node_id}`,
        );

        try {
            return await this.nodeSelectedProcess.handle(ctx, node_id);
        } catch (e) {
            logger.error(e);
            client.emit('ErrorMessage', {
                message: `An Error has ocurred selecting the node`,
            });
        }
    }

    @SubscribeMessage('ContinueExpedition')
    async handleContinueExpedition(client: Socket): Promise<string> {
        const ctx = await this.expeditionService.getGameContext(client);
        this.logger.info(
            ctx.info,
            `Client ${client.id} will advance to the next node`,
        );

        return this.continueExpeditionProcess.handle(ctx);
    }

    @SubscribeMessage('NodeSkipped')
    async handleNodeSkipped(client: Socket, nodeId: number): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);

        this.logger.info(
            ctx.info,
            `Client ${client.id} trigger message "NodeSkipped": ${nodeId}`,
        );

        await this.expeditionService.overrideAvailableNode({
            ctx,
            nodeId: ~~nodeId,
        });
    }
}
