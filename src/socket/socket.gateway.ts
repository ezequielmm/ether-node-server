import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGatewayService } from 'src/authGateway/authGateway.service';
import { ExpeditionService } from 'src/expedition/expedition.service';
import { CardPlayedInterface } from 'src/interfaces/cardPlayed.interface';
import { SocketClientService } from 'src/socketClient/socketClient.service';

@WebSocketGateway(7777, {
    cors: {
        origin: '*',
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    private readonly logger: Logger = new Logger(SocketGateway.name);

    constructor(
        private readonly authGatewayService: AuthGatewayService,
        private readonly socketClientService: SocketClientService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async afterInit(): Promise<void> {
        await this.socketClientService.clearClients();
        this.logger.log(`Socket Initiated`);
    }

    //#region handleConnection
    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client attempting a connection: ${client.id}`);
        const { authorization } = client.handshake.headers;

        if (!authorization) {
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }

        try {
            const {
                data: {
                    data: { id },
                },
            } = await this.authGatewayService.getUser(authorization);

            await this.socketClientService.create({
                player_id: id,
                client_id: client.id,
            });

            this.logger.log(`Client connected: ${client.id}`);

            const { map, player_state } =
                await this.expeditionService.getExpeditionByPlayerId(id);

            client.emit('ExpeditionMap', JSON.stringify({ data: map }));
            client.emit('PlayerState', JSON.stringify({ data: player_state }));
        } catch (e) {
            this.logger.log(e.message);
            this.logger.log(`Client has an invalid auth token: ${client.id}`);
            client.disconnect(true);
        }
    }
    //#endregion

    //#region handleDisconnect
    async handleDisconnect(client: Socket): Promise<void> {
        await this.socketClientService.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    //#endregion

    //#region handleSyncExpedition
    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        const { player_id } =
            await this.socketClientService.getSocketClientPlayerIdByClientId(
                client.id,
            );

        const { map, player_state } =
            await this.expeditionService.getExpeditionByPlayerId(player_id);

        client.emit('ExpeditionMap', JSON.stringify({ data: map }));
        client.emit('PlayerState', JSON.stringify({ data: player_state }));
    }
    //#endregion

    //#region handleNodeSelected
    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        const { player_id } =
            await this.socketClientService.getSocketClientPlayerIdByClientId(
                client.id,
            );

        // Check later the validation and check if the player can move to the next node
        // And make sure that the current node is completed

        const node = await this.expeditionService.getExpeditionMapNodeById(
            player_id,
            node_id,
        );

        if (!node)
            return JSON.stringify({
                data: { message: 'Invalid Node Provided' },
            });

        const cards = await this.expeditionService.getCardsByPlayerId(
            player_id,
        );

        const handCards = cards.sort(() => 0.5 - Math.random()).slice(0, 5);

        const { current_node } =
            await this.expeditionService.updateExpeditionByPlayerId(player_id, {
                current_node: {
                    node_id,
                    completed: false,
                    node_type: node.type,
                    data: {
                        round: 1,
                        action: 0,
                        player: {
                            energy: 3,
                            energy_max: 3,
                            hand_size: 5,
                            cards: {
                                draw: cards,
                                hand: handCards,
                            },
                        },
                    },
                },
            });

        return JSON.stringify({ data: current_node });
    }
    //#endregion

    //#region handleCardPlayed
    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<string> {
        const { player_id } =
            await this.socketClientService.getSocketClientPlayerIdByClientId(
                client.id,
            );

        const { card_id }: CardPlayedInterface = JSON.parse(payload);

        const cardExists = await this.expeditionService.cardExistsOnPlayerHand(
            player_id,
            card_id,
        );

        if (!cardExists)
            return JSON.stringify({
                data: { message: 'Card played is not valid' },
            });

        const {
            data: {
                player: { energy },
            },
        } = await this.expeditionService.getCurrentNodeByPlayerId(player_id);

        if (energy === 0)
            return JSON.stringify({
                data: { message: 'Not enough energy left' },
            });

        const { current_node } =
            await this.expeditionService.moveCardFromPlayerHandToDiscard(
                player_id,
                card_id,
            );

        return JSON.stringify({ current_node });
    }
    //#endregion
}
