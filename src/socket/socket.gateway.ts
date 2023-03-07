import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { isValidAuthToken } from 'src/utils';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { NodeType } from 'src/game/components/expedition/node-type';
import { PlayerService } from 'src/game/components/player/player.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CardSelectionScreenService } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.service';
import { corsSocketSettings } from './socket.enum';
import { isEmpty } from 'lodash';

@WebSocketGateway(corsSocketSettings)
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(SocketGateway.name);

    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
        private readonly fullSyncAction: FullSyncAction,
        private readonly playerService: PlayerService,
        private readonly combatQueueService: CombatQueueService,
        private readonly cardSelectionScreenService: CardSelectionScreenService,
    ) {}

    afterInit(): void {
        this.logger.log(`Socket Initiated`);
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(
            client.handshake,
            `Client attempting a connection: ${client.id}`,
        );

        const { authorization } = client.handshake.headers;

        if (!isValidAuthToken(authorization)) {
            this.logger.log(
                {
                    authorization,
                    clientId: client.id,
                },
                'Client has an invalid auth token',
            );
            client.disconnect(true);
        }

        try {
            const { id: playerId } = await this.authGatewayService.getUser(
                authorization,
            );

            await this.expeditionService.updateClientId({
                playerId,
                clientId: client.id,
            });

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
                if (expedition.currentNode !== undefined) {
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
                        clientId: client.id,
                        playerId,
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

    async handleDisconnect(client: Socket): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);

        // Clear Combat queue
        await this.combatQueueService.deleteCombatQueueByClientId(client.id);
        this.logger.log(
            ctx.info,
            `Deleted combat queue for client ${client.id}`,
        );

        // Clear Card Selection Queue
        await this.cardSelectionScreenService.deleteByClientId(client.id);
        this.logger.log(
            ctx.info,
            `Deleted card selection screen items for client ${client.id}`,
        );

        // Update player connection status
        await this.expeditionService.updatePlayerStatus({
            clientId: client.id,
            isCurrentlyPlaying: false,
        });

        // Log disconnection event
        this.logger.log(ctx.info, `Client disconnected: ${client.id}`);
    }
}
