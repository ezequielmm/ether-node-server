import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { corsSocketSettings } from './socket.enum';
import { TreasureService } from 'src/game/treasure/treasure.service';

@WebSocketGateway(corsSocketSettings)
export class TreasureGateway {
    private readonly logger: Logger = new Logger(TreasureGateway.name);

    constructor(private readonly treasureService: TreasureService) {}

    @SubscribeMessage('ChestOpened')
    async handleItemsSelected(client: Socket): Promise<void> {
        this.logger.debug(`Client ${client.id} trigger message "OpenTreasure"`);

        await this.treasureService.handle(client);
    }

    @SubscribeMessage('TreasureData')
    async merchantData(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} get treasure data "TreasureData"`,
        );

        await this.treasureService.treasureData(client);
    }
    @SubscribeMessage('CombatEncounter')
    async combatEncounter(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} get treasure data "CombatEncounter"`,
        );

        await this.treasureService.combatEncounter(client);
    }
}
