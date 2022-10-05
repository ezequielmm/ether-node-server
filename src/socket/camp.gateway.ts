import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ExpeditionDocument } from 'src/game/components/expedition/expedition.schema';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class CampGateway {
    private readonly logger: Logger = new Logger(CampGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly playerService: PlayerService,
    ) {}

    @SubscribeMessage('CampRecoverHealth')
    async handleRecoverHealth(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "RecoverHealth"`,
        );

        // First we get the actual player state to get the
        // actual health and max health for the player
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const {
            playerState: { hpCurrent, hpMax },
        } = expedition;

        // Now we calculate the new health for the player
        // Here we increase the health by 30% or set it to the
        // hpMax value is the result is higher than hpMax
        const newHp = Math.floor(Math.min(hpMax, hpCurrent + hpCurrent * 0.3));

        // Now we update the current hp for the player
        await this.playerService.setGlobalHp(
            { client, expedition: expedition as ExpeditionDocument },
            newHp,
        );

        const { playerState } = await this.expeditionService.findOne({
            clientId: client.id,
        });

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
