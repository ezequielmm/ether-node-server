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
import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import { InitCombatProcess } from 'src/game/process/initCombat.process';
import { PlayerService } from 'src/game/components/player/player.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger: Logger = new Logger(SocketGateway.name);

    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly expeditionService: ExpeditionService,
        private readonly fullsyncAction: FullSyncAction,
        private readonly initCombatProcess: InitCombatProcess,
        private readonly playerService: PlayerService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    afterInit(): void {
        this.logger.log(`Socket Initiated`);
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client attempting a connection: ${client.id}`);

        const { authorization } = client.handshake.headers;

        if (!isValidAuthToken(authorization)) {
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }

        try {
            const {
                data: {
                    data: { id: playerId },
                },
            } = await this.authGatewayService.getUser(authorization);

            const expedition = await this.expeditionService.updateClientId({
                clientId: client.id,
                playerId,
            });

            if (expedition) {
                this.logger.log(`Client connected: ${client.id}`);

                const { currentNode } = expedition;

                // Here we check if the player is in a node already
                if (currentNode !== undefined) {
                    const { nodeType, nodeId } = currentNode;
                    const nodeTypes = Object.values(ExpeditionMapNodeTypeEnum);
                    const combatNodes = nodeTypes.filter(
                        (node) => node.search('combat') !== -1,
                    );

                    if (combatNodes.includes(nodeType)) {
                        const node =
                            await this.expeditionService.getExpeditionMapNode({
                                clientId: client.id,
                                nodeId,
                            });

                        const { hpCurrent } =
                            await this.expeditionService.getPlayerState({
                                clientId: client.id,
                            });

                        await this.playerService.setHp(
                            {
                                client,
                                expedition,
                            },
                            hpCurrent,
                        );

                        await this.initCombatProcess.process(client, node);
                    }
                }

                await this.fullsyncAction.handle(client);
            } else {
                this.logger.log(
                    `There is no expedition in progress for this player: ${client.id}`,
                );

                client.disconnect(true);
            }
        } catch (e) {
            this.logger.log(e.message);
            this.logger.log(e.stack);
            client.disconnect(true);
        }
    }

    async handleDisconnect(client: Socket): Promise<void> {
        this.logger.log(`Client disconnected: ${client.id}`);

        this.logger.log(`Deleted combat queue for client ${client.id}`);

        await this.combatQueueService.deleteCombatQueueByClientId(client.id);
    }
}
