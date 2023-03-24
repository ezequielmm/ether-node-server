import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { NodeSelectedProcess } from 'src/game/process/nodeSelected.process';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { corsSocketSettings } from './socket.enum';
import { ContinueExpeditionProcess } from 'src/game/process/continueExpedition.process';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';

@WebSocketGateway(corsSocketSettings)
export class ExpeditionGateway {
    constructor(
        @InjectPinoLogger(ExpeditionGateway.name)
        private readonly logger: PinoLogger,
        private readonly nodeSelectedProcess: NodeSelectedProcess,
        private readonly fullSyncAction: FullSyncAction,
        private readonly expeditionService: ExpeditionService,
        private readonly continueExpeditionProcess: ContinueExpeditionProcess,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<SYNC EXPEDITION>');
                const ctx = await this.expeditionService.getGameContext(client);
                this.logger.info(
                    ctx.info,
                    `Client ${client.id} trigger message "SyncExpedition"`,
                );

                await this.fullSyncAction.handle(client);
                this.logger.debug('</SYNC EXPEDITION>');
            }
        );
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        const waiter = { done: false, data: "" };

        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<NODE SELECTED>');
                const ctx = await this.expeditionService.getGameContext(client);
                const logger = this.logger.logger.child(ctx.info);

                logger.info(
                    ctx.info,
                    `Client ${client.id} trigger message "NodeSelected": ${node_id}`,
                );

                try {
                    waiter.data = await this.nodeSelectedProcess.handle(ctx, node_id);
                    waiter.done = true;
                } catch (e) {
                    logger.error(e);
                    client.emit('ErrorMessage', {
                        message: `An Error has ocurred selecting the node`,
                    });
                }

                this.logger.debug('</NODE SELECTED>');
            }
        );

        const wait = (ms) => new Promise(res => setTimeout(res, ms));
        let loopBreak = 50;

        while (!waiter.done || loopBreak <= 0) {
            await wait(100);
            loopBreak--;
        }

        return (waiter.done) ? waiter.data : undefined;
    }

    @SubscribeMessage('ContinueExpedition')
    async handleContinueExpedition(client: Socket): Promise<string> {
        const waiter = { done: false, data: "" };

        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<CONTINUTE EXPEDITION>');
                const ctx = await this.expeditionService.getGameContext(client);
                this.logger.info(
                    ctx.info,
                    `Client ${client.id} will advance to the next node`,
                );

                waiter.data = await this.continueExpeditionProcess.handle(ctx);
                waiter.done = true;
                
                this.logger.debug('</CONTINUTE EXPEDITION>');
            }
        );

        const wait = (ms) => new Promise(res => setTimeout(res, ms));
        let loopBreak = 50;

        while (!waiter.done || loopBreak <= 0) {
            await wait(100);
            loopBreak--;
        }

        return (waiter.done) ? waiter.data : undefined;
    }

    @SubscribeMessage('NodeSkipped')
    async handleNodeSkipped(client: Socket, nodeId: number): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<NODE SKIPPED>');
                const ctx = await this.expeditionService.getGameContext(client);

                this.logger.info(
                    ctx.info,
                    `Client ${client.id} trigger message "NodeSkipped": ${nodeId}`,
                );

                await this.expeditionService.overrideAvailableNode({
                    ctx,
                    nodeId: ~~nodeId,
                });
                this.logger.debug('</NODE SKIPPED>');
            }
        );
    }
}
