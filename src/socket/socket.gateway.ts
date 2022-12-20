import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { isValidAuthToken } from 'src/utils';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import { PlayerService } from 'src/game/components/player/player.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CardSelectionScreenService } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.service';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(SocketGateway.name);

    @WebSocketServer() server: Server;

    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
        private readonly fullSyncAction: FullSyncAction,
        private readonly playerService: PlayerService,
        private readonly combatQueueService: CombatQueueService,
        private readonly cardSelectionScreenService: CardSelectionScreenService,
    ) {}

    afterInit(): void {
        this.logger.debug(`Socket Initiated`);
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.debug(`Client attempting a connection: ${client.id}`);

        const { authorization } = client.handshake.headers;

        if (!isValidAuthToken(authorization)) {
            this.logger.debug(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }

        try {
            const { id: playerId } = await this.authGatewayService.getUser(
                authorization,
            );

            const expedition = await this.expeditionService.updateClientId({
                clientId: client.id,
                playerId,
            });

            const ctx = await this.expeditionService.getGameContext(client);

            if (expedition) {
                this.logger.debug(`Client connected: ${client.id}`);

                // Here we check if the player is in a node already
                if (expedition.currentNode !== undefined) {
                    const { nodeType } = expedition.currentNode;

                    if (nodeType === ExpeditionMapNodeTypeEnum.Combat) {
                        const { hpCurrent } =
                            await this.expeditionService.getPlayerState({
                                clientId: client.id,
                            });

                        await this.playerService.setHp(ctx, hpCurrent);
                    }
                }

                await this.fullSyncAction.handle(client);

                this.logger.verbose(
                    `Clients connected: ${this.server.engine.clientsCount}`,
                );
            } else {
                this.logger.debug(
                    `There is no expedition in progress for this player: ${client.id}`,
                );

                client.disconnect(true);
            }
        } catch (e) {
            this.logger.debug(e.message);
            this.logger.debug(e.stack);
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket): Promise<void> {
        this.logger.debug(`Client disconnected: ${client.id}`);

        // Clear Combat queue
        await this.combatQueueService.deleteCombatQueueByClientId(client.id);
        this.logger.debug(`Deleted combat queue for client ${client.id}`);

        // Clear Card Selection Queue
        await this.cardSelectionScreenService.deleteByClientId(client.id);
        this.logger.debug(
            `Deleted card selection screen items for client ${client.id}`,
        );

        // Update player connection status
        await this.expeditionService.updatePlayerStatus({
            clientId: client.id,
            isCurrentlyPlaying: false,
        });

        // Log amount of clients connected
        this.logger.verbose(
            `Clients connected: ${this.server.engine.clientsCount}`,
        );
    }
}
