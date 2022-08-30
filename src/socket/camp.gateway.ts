import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CampGateway {
    private readonly logger: Logger = new Logger(CampGateway.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    @SubscribeMessage('RecoverHealth')
    async handleRecoverHealth(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "RecoverHealth"`,
        );

        // First we get the actual player state to get the
        // actual health and max health for the player
        const {} = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });
    }

    @SubscribeMessage('ShowUpgradeCard')
    async handleShowUpgradeCard(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "ShowUpgradeCard"`,
        );
    }
}
