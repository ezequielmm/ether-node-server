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

    @SubscribeMessage('MerchantBuy')
    async handleItemsSelected(
        client: Socket,
        selected: selectedItem,
    ): Promise<void> {
        this.logger.debug(`Client ${client.id} trigger message "MerchantBuy"`);
        this.merchantService.merchantBuy(client, selected);
    }
}
