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

            const { map, player_state } =
                await this.expeditionService.updateClientId({
                    player_id,
                    client_id: client.id,
                });

            client.emit('ExpeditionMap', JSON.stringify({ data: map }));
            client.emit(
                'PlayerState',
                JSON.stringify({ data: { player_state } }),
            );
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

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        const { map, player_state } = await this.expeditionService.findOne({
            client_id: client.id,
            status: ExpeditionStatusEnum.InProgress,
        });

        client.emit('ExpeditionMap', JSON.stringify({ data: map }));
        client.emit('PlayerState', JSON.stringify({ data: { player_state } }));

        this.logger.log(
            `Sending message "ExpeditionMap" to client ${client.id}`,
        );
        this.logger.log(`Sending message "PlayerState" to client ${client.id}`);
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

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<string> {
        const { card_id }: CardPlayedInterface = JSON.parse(payload);

        this.logger.log(
            `Client ${client.id} trigger message "CardPlayed": ${payload}`,
        );

        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            client_id: client.id,
            card_id,
        });

        // First make sure card exists on player's hand pile

        if (!cardExists)
            return JSON.stringify({
                data: { message: 'Card played is not valid' },
            });

        // Then, we query the card info to get its energy cost
        const { energy: cardEnergy } = await this.cardService.findById(card_id);

        // Then, we get the actual energy amount from the current state
        const {
            data: {
                player: { energy: playerEnergy },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        // Then we make sure that the energy cost for the card is lower that the
        // available energy for the player
        if (cardEnergy > playerEnergy || playerEnergy === 0)
            return JSON.stringify({
                data: { message: 'Not enough energy left' },
            });

        await this.expeditionService.moveCardFromPlayerHandToDiscardPile({
            client_id: client.id,
            card_id,
        });

        const newEnergyAmount = playerEnergy - cardEnergy;

        const { current_node } =
            await this.expeditionService.updatePlayerEnergy({
                client_id: client.id,
                energy: newEnergyAmount,
            });

        return JSON.stringify({ data: current_node });
    }

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<string> {
        this.logger.log(`Client ${client.id} trigger message "EndTurn"`);

        await this.expeditionService.moveAllCardsToDiscardPile(client.id);

        const {
            current_node: {
                data: {
                    player: { energy_max },
                },
            },
        } = await this.expeditionService.moveCardsFromDrawToHandPile(client.id);

        const { current_node } =
            await this.expeditionService.updatePlayerEnergy({
                client_id: client.id,
                energy: energy_max,
            });

        return JSON.stringify({ data: current_node });
    }
}
