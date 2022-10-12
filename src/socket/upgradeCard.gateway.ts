import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class UpgradeCardGateway {
    private readonly logger: Logger = new Logger(UpgradeCardGateway.name);

    @SubscribeMessage('CardUpgradeSelected')
    async handleCardUpgradeSelected(
        client: Socket,
        cardId: string,
    ): Promise<void> {
        this.logger.debug(`Client ${client.id} trigger message "UpgradeCard"`);
    }
}
