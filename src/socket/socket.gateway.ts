import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { isValidAuthToken } from '../utils';
import { AuthGatewayService } from '../authGateway/authGateway.service.';
import { ExpeditionService } from '../game/expedition/expedition.service';
import { ExpeditionStatusEnum } from '../game/expedition/enums';
import { CardService } from '../game/components/card/card.service';
import { CardPlayedInterface } from './interfaces';
import { FullSyncAction } from '../game/expedition/action/fullSync.action';

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
        private readonly cardService: CardService,
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
                    data: { id: player_id },
                },
            } = await this.authGatewayService.getUser(authorization);

            await this.expeditionService.updateClientId({
                player_id,
                client_id: client.id,
            });

            await new FullSyncAction().handle(client);

            this.logger.log(`Client connected: ${client.id}`);
        } catch (e) {
            this.logger.log(e.message);
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "NodeSelected": ${node_id}`,
        );

        const node = await this.expeditionService.getExpeditionMapNode(
            client.id,
            node_id,
        );

        const cards = await this.expeditionService.getDeckCards(client.id);

        const handCards = cards.sort(() => 0.5 - Math.random()).slice(0, 5);

        const drawCards = this.cardService.removeHandCardsFromDrawPile(
            cards,
            handCards,
        );

        const { current_node } = await this.expeditionService.update(
            { client_id: client.id, status: ExpeditionStatusEnum.InProgress },
            {
                current_node: {
                    node_id,
                    completed: false,
                    node_type: node.type,
                    data: {
                        round: 0,
                        action: 0,
                        player: {
                            energy: 3,
                            energy_max: 5,
                            hand_size: 5,
                            cards: {
                                draw: drawCards,
                                hand: handCards,
                            },
                        },
                    },
                },
            },
        );

        return JSON.stringify({ data: current_node });
    }
}
