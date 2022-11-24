import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { corsSocketSettings } from './socket.enum';
import { TreasureService } from 'src/game/treasure/treasure.service';

@WebSocketGateway(corsSocketSettings)
export class TreasureGateway {
    private readonly logger: Logger = new Logger(TreasureGateway.name);

    constructor(private readonly treasureService: TreasureService) {}

    @SubscribeMessage('OpenChest')
    async handleOpenChest(client: Socket): Promise<void> {
        this.logger.debug(`Client ${client.id} trigger message "OpenChest"`);

        await this.treasureService.openChest(client);
    }
}
