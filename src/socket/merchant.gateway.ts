import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { corsSocketSettings } from './socket.enum';
import { MerchantService } from 'src/game/merchant/merchant.service';
import { selectedItem } from 'src/game/merchant/interfaces';

@WebSocketGateway(corsSocketSettings)
export class MerchantGateway {
    private readonly logger: Logger = new Logger(MerchantGateway.name);

    constructor(private readonly merchantService: MerchantService) {}

    @SubscribeMessage('PurchaseItem')
    async handleItemsSelected(
        client: Socket,
        selected: selectedItem,
    ): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "ItemsSelected"`,
        );

        await this.merchantService.handle(client, selected);
    }
    @SubscribeMessage('MerchantData')
    async merchantData(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} get merchant data "MerchantData"`,
        );

        await this.merchantService.merchantData(client);
    }
    @SubscribeMessage('CardUpgrade')
    async cardUpgrade(client: Socket, payload: string): Promise<void> {
        this.logger.debug(
            `Client ${client.id} get merchant data "CardUpgrade"`,
        );
        const { cardId } = JSON.parse(payload);

        await this.merchantService.cardUpgrade(client, cardId);
    }
    @SubscribeMessage('CardDestroy')
    async cardDestroy(client: Socket, payload: string): Promise<void> {
        this.logger.debug(
            `Client ${client.id} get merchant data "CardDestroy"`,
        );
        const { cardId } = JSON.parse(payload);

        await this.merchantService.cardDestroy(client, cardId);
    }
}
