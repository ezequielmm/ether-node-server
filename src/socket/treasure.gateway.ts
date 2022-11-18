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

    @SubscribeMessage('CombatEncounter')
    async combatEncounter(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} get treasure data "CombatEncounter"`,
        );

        await this.treasureService.combatEncounter(client);
    }
    @SubscribeMessage('TreasureRewardSelected')
    async TreasureRewardSelected(
        client: Socket,
        rewardId: string,
    ): Promise<void> {
        this.logger.debug(`Client ${client.id} choose reward id: ${rewardId}`);
        console.log(rewardId, 'jjjj');
        await this.treasureService.rewardSelected(client, rewardId);
    }
}
