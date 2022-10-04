import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class CampGateway {
    private readonly logger: Logger = new Logger(CampGateway.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    @SubscribeMessage('CampRecoverHealth')
    async handleRecoverHealth(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "RecoverHealth"`,
        );

        // First we get the actual player state to get the
        // actual health and max health for the player
        const { hpCurrent, hpMax } =
            await this.expeditionService.getPlayerState({
                clientId: client.id,
            });

        // Now we calculate the new health for the player
        // Here we increase the health by 30% or set it to the
        // hpMax value is the result is higher than hpMax
        const newHp = Math.floor(Math.min(hpMax, hpCurrent + hpCurrent * 0.3));

        // now we update the current hp for the player
        const { playerState } = await this.expeditionService.update(client.id, {
            playerState: { hpCurrent: newHp },
        });

        // Send update message to client
        this.logger.debug(`Sent message PlayerState to client ${client.id}`);

        client.emit(
            'PlayerState',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerStateUpdate,
                action: SWARAction.UpdatePlayerState,
                data: { playerState },
            }),
        );
    }
}
