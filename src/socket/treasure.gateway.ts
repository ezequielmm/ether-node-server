import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { corsSocketSettings } from './socket.enum';
import { TreasureService } from 'src/game/treasure/treasure.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';

@WebSocketGateway(corsSocketSettings)
export class TreasureGateway {
    private readonly logger: Logger = new Logger(TreasureGateway.name);

    constructor(
        private readonly treasureService: TreasureService,
        private readonly expeditionService: ExpeditionService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('ChestOpened')
    async handleOpenChest(client: Socket): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(
                client.id,
            ),
            async () => {
                this.logger.debug('<OPEN CHEST>');

                const ctx = await this.expeditionService.getGameContext(client);

                this.logger.log(
                    ctx.info,
                    `Client ${client.id} trigger message "ChestOpened"`,
                );

                await this.treasureService.openChest(client);

                this.logger.debug('</OPEN CHEST>');
            }
        );
    }
}
