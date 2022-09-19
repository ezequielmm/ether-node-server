import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class CampGateway {
    private readonly logger: Logger = new Logger(CampGateway.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    @SubscribeMessage('RecoverHealth')
    async handleRecoverHealth(client: Socket): Promise<string> {
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

        // now we update the current hp for the player, as is just update
        // we do it on the player state directly
        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            { playerState: { hpCurrent: newHp } },
        );

        // Now we return the message to let the frontend know the new
        // health
        return JSON.stringify(
            StandardResponse.respond({
                message_type: SWARMessageType.CampUpdate,
                action: SWARAction.IncreasePlayerHealth,
                data: { newHp },
            }),
        );
    }

    @SubscribeMessage('ShowUpgradeCard')
    async handleShowUpgradeCard(client: Socket): Promise<string> {
        this.logger.debug(
            `Client ${client.id} trigger message "ShowUpgradeCard"`,
        );

        // First we get the cards from the deck and send them to the
        // frontend

        const { cards } = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });

        return JSON.stringify(
            StandardResponse.respond({
                message_type: SWARMessageType.CampUpdate,
                action: SWARAction.ShowPlayerDeck,
                data: { cards },
            }),
        );
    }
}
