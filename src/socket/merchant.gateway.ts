import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { corsSocketSettings } from './socket.enum';
import { MerchantService } from 'src/game/merchant/merchant.service';
import { SelectedItem } from 'src/game/merchant/merchant.interface';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';

@WebSocketGateway(corsSocketSettings)
export class MerchantGateway {
    private readonly logger: Logger = new Logger(MerchantGateway.name);

    constructor(
        private readonly merchantService: MerchantService,
        private readonly expeditionService: ExpeditionService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('MerchantBuy')
    async handleItemsSelected(client: Socket, payload: string): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<MERCHANT ACTION>');

                const ctx = await this.expeditionService.getGameContext(client);

                this.logger.log(
                    ctx.info,
                    `Client ${client.id} trigger message "MerchantBuy": ${payload}`,
                );

                const selected = JSON.parse(payload) as SelectedItem;
                await this.merchantService.buyItem(ctx, selected);

                this.logger.debug('</MERCHANT ACTION>');
            },
        );
    }
}
