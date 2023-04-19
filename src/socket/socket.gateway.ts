import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { NodeType } from 'src/game/components/expedition/node-type';
import { PlayerService } from 'src/game/components/player/player.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CardSelectionScreenService } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.service';
import { corsSocketSettings } from './socket.enum';
import { isEmpty } from 'lodash';
import { WebsocketAuthGuard } from 'src/auth/websocketAuth.guard';
import { AuthorizedSocket } from 'src/auth/auth.types';

@WebSocketGateway(corsSocketSettings)
@UseGuards(WebsocketAuthGuard)
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(SocketGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly fullSyncAction: FullSyncAction,
        private readonly playerService: PlayerService,
        private readonly combatQueueService: CombatQueueService,
        private readonly cardSelectionScreenService: CardSelectionScreenService,
    ) {}

    afterInit(): void {
        this.logger.log(`Socket Initiated`);
    }

    async handleConnection(client: AuthorizedSocket): Promise<void> {
        this.logger.log(
            client.handshake,
            `Client attempting a connection: ${client.id}`,
        );

        try {
            const userAddress = client.userAddress;

            const clientUpdated = await this.expeditionService.updateClientId({
                userAddress,
                clientId: client.id,
            });

            if (!clientUpdated) {
                this.logger.log(
                    {
                        userAddress,
                        clientId: client.id,
                    },
                    'Player did not have an expedition. This should never happen.',
                );
                client.disconnect(true);
                return;
            }

            const ctx = await this.expeditionService.getGameContext(client);
            const expedition = ctx.expedition;

            client.prependAny((event, ...args) => {
                this.logger.log(
                    {
                        ...ctx.info,
                        event,
                        args: args.map((arg) => {
                            try {
                                return JSON.parse(arg);
                            } catch (error) {
                                return arg;
                            }
                        }),
                    },
                    'Client sent a message',
                );
            });

            client.prependAnyOutgoing((event, ...args) => {
                this.logger.log(
                    {
                        ...ctx.info,
                        event,
                        args: args.map((arg) => {
                            try {
                                return JSON.parse(arg);
                            } catch (error) {
                                return arg;
                            }
                        }),
                    },
                    'Server sent a message',
                );
            });

            if (expedition) {
                this.logger.log(ctx.info, `Client connected to expedition`);

                // Here we check if the player is in a node already
                if (typeof expedition.currentNode !== 'undefined') {
                    const { nodeType } = expedition.currentNode;

                    if (
                        nodeType === NodeType.Combat &&
                        !isEmpty(expedition.currentNode.data)
                    ) {
                        await this.playerService.setGlobalHp(
                            ctx,
                            expedition.currentNode.data.player.hpCurrent,
                        );
                    }
                }

                await this.fullSyncAction.handle(client, true);
            } else {
                this.logger.log(
                    {
                        userAddress,
                        clientId: client.id,
                    },
                    'There is no expedition in progress for this player',
                );

                client.disconnect(true);
            }
        } catch (e) {
            this.logger.error(e);
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: AuthorizedSocket): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);

        // Clear Combat queue
        await this.combatQueueService.deleteCombatQueueByClientId(client.id);
        this.logger.log(
            ctx.info,
            `Deleted combat queue for client ${client.id}, ${client.userAddress}`,
        );

        // Clear Card Selection Queue
        await this.cardSelectionScreenService.deleteByClientId(client.id);
        this.logger.log(
            ctx.info,
            `Deleted card selection screen items for client ${client.id}, ${client.userAddress}`,
        );

        // Update player connection status
        await this.expeditionService.updatePlayerStatus({
            clientId: client.id,
            isCurrentlyPlaying: false,
        });

        // Log disconnection event
        this.logger.log(
            ctx.info,
            `Client disconnected: ${client.id}, ${client.userAddress}`,
        );
    }
}
