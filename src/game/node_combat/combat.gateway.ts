import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EndTurnAction } from './actions/endTurn.action';
import { CardPlayedInterface } from '../../socket/interfaces';
import { CardPlayedAction } from './actions/cardPlayed.action';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<string> {
        this.logger.log(`Client ${client.id} trigger message "EndTurn"`);

        return await new EndTurnAction().handle(client);
    }

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "CardPlayed": ${payload}`,
        );

        const { card_id }: CardPlayedInterface = JSON.parse(payload);

        return await new CardPlayedAction().handle(client, card_id);
    }
}
