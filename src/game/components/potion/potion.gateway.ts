import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { corsSocketSettings } from 'src/socket/socket.enum';
import { ExpeditionService } from '../expedition/expedition.service';
import { PotionService } from './potion.service';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';
import { Logger } from '@nestjs/common';

interface UsePotionDTO {
    potionId: string;
    targetId: string;
}

@WebSocketGateway(corsSocketSettings)
export class PotionGateway {
    private readonly logger: Logger = new Logger(PotionGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly potionService: PotionService,
        private readonly fullSyncAction: FullSyncAction,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('UsePotion')
    async use(client: Socket, payload: string): Promise<void> {
        const expeditionId = await this.expeditionService.getExpeditionIdFromClient(client);

        await this.actionQueueService.push(expeditionId, async () => {
            
            this.logger.debug('<USE POTION>');

            const { potionId, targetId } = JSON.parse(payload) as UsePotionDTO;
            const ctx = await this.expeditionService.getGameContext(client);

            await this.potionService.use(ctx, potionId, targetId);
            await this.fullSyncAction.handle(client, false);

            this.logger.debug('</USE POTION>');
        });
    }

    @SubscribeMessage('RemovePotion')
    async remove(client: Socket, potionId: string): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client),
            async () => {
                this.logger.debug('<REMOVE POTION>');

                const ctx = await this.expeditionService.getGameContext(client);
                await this.potionService.remove(ctx, potionId);
                await this.fullSyncAction.handle(client, false);

                this.logger.debug('</REMOVE POTION>');
            },
        );
    }
}
