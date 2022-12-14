import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
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
    async handleRecoverHealth(client: Socket): Promise<string> {
        this.logger.debug(
            `Client ${client.id} trigger message "CampRecoverHealth"`,
        );

        // First we get the actual player state to get the
        // actual health and max health for the player
        const ctx = await this.expeditionService.getGameContext(client);

        const {
            playerState: { hpCurrent, hpMax },
        } = ctx.expedition;

        // Now we calculate the new health for the player
        // Here we increase the health by 30% or set it to the
        // hpMax value is the result is higher than hpMax
        const newHp = Math.floor(Math.min(hpMax, hpCurrent + hpMax * 0.3));

        // Now we update the current hp for the player
        await this.playerService.setGlobalHp(ctx, newHp);

        this.logger.debug(`Sent message PlayerState to client ${client.id}`);

        client.emit(
            'PlayerState',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerStateUpdate,
                action: SWARAction.UpdatePlayerState,
                data: {
                    playerState: {
                        id: ctx.expedition.playerState.playerId,
                        playerId: ctx.expedition.playerId,
                        playerName: ctx.expedition.playerState.playerName,
                        characterClass:
                            ctx.expedition.playerState.characterClass,
                        hpMax: ctx.expedition.playerState.hpMax,
                        hpCurrent: ctx.expedition.playerState.hpCurrent,
                        gold: ctx.expedition.playerState.gold,
                        cards: ctx.expedition.playerState.cards,
                        potions: ctx.expedition.playerState.potions,
                        trinkets: ctx.expedition.playerState.trinkets,
                    },
                },
            }),
        );

        //Send message to finish the node and change the button text
        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.CampUpdate,
                action: SWARAction.FinishCamp,
                data: null,
            }),
        );

        return StandardResponse.respond({
            message_type: SWARMessageType.CampUpdate,
            action: SWARAction.HealAmount,
            data: { healed: newHp - hpCurrent },
        });
    }
}