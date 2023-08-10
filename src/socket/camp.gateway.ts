import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { SettingsService } from 'src/game/components/settings/settings.service';

@WebSocketGateway(corsSocketSettings)
export class CampGateway {
    private readonly logger: Logger = new Logger(CampGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly playerService: PlayerService,
        private readonly actionQueueService: ActionQueueService,
        private readonly settingsService: SettingsService,
    ) {}

    @SubscribeMessage('CampRecoverHealth')
    async handleRecoverHealth(client: Socket): Promise<string> {
        const { healPercentageInCamp } =
            await this.settingsService.getSettings();

        return await this.actionQueueService.pushWithReturn(
            await this.expeditionService.getExpeditionIdFromClient(client),
            async () => {
                this.logger.debug('<CAMP RECOVER HEALTH>');
                // First we get the actual player state to get the
                // actual health and max health for the player
                const ctx = await this.expeditionService.getGameContext(client);

                const {
                    playerState: { hpCurrent, hpMax },
                } = ctx.expedition;

                // Now we calculate the new health for the player
                // Here we increase the health by 30% or set it to the
                // hpMax value is the result is higher than hpMax
                const newHp = Math.floor(
                    hpCurrent + hpMax * healPercentageInCamp,
                );

                // Now we update the current hp for the player
                await this.playerService.setHPDelta({ ctx, hpDelta: newHp });

                client.emit(
                    'PlayerState',
                    StandardResponse.respond({
                        message_type: SWARMessageType.PlayerStateUpdate,
                        action: SWARAction.UpdatePlayerState,
                        data: {
                            playerState: {
                                id: ctx.expedition.playerState.userAddress,
                                userAddress: ctx.expedition.userAddress,
                                playerName:
                                    ctx.expedition.playerState.playerName,
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

                this.logger.debug('</CAMP RECOVER HEALTH>');

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.HealAmount,
                    data: { healed: newHp - hpCurrent },
                });
            },
        );
    }
}
