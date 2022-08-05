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
import { CharacterService } from 'src/game/components/character/character.service';
import { CharacterClassEnum } from 'src/game/components/character/character.enum';
import { PlayerService } from 'src/game/components/player/player.service';

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
        private readonly characterService: CharacterService,
        private readonly playerService: PlayerService,
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

                        const { initialHealth } =
                            await this.characterService.findOne({
                                characterClass: CharacterClassEnum.Knight,
                            });

                        await this.playerService.setHp(
                            {
                                client,
                                expedition,
                            },
                            initialHealth,
                        );

                        await this.initCombatProcess.process(client, node);
                    }
                }

                await this.fullsyncAction.handle(client);
            } else {
                this.logger.error(
                    `There is no expedition in progress for this player: ${client.id}`,
                );

                await this.expeditionService.updateClientId({
                    clientId: null,
                    playerId,
                });

                client.disconnect(true);
            }
        } catch (e) {
            this.logger.log(e.message);
            this.logger.log(e.stack);
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}
