import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger, UseFilters } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EndTurnAction } from './actions/endTurn.action';
import { CardPlayedInterface } from '../../socket/interfaces';
import { CardPlayedAction } from './actions/cardPlayed.action';
import { CustomExceptionFilter } from 'src/socket/customException.filter';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseFilters(CustomExceptionFilter)
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);

    constructor(
        private readonly endTurnAction: EndTurnAction,
        private readonly cardPlayedAction: CardPlayedAction,
    ) {}

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<string> {
        this.logger.log(`Client ${client.id} trigger message "EndTurn"`);

        try {
            return await this.endTurnAction.handle(client);
        } catch (e) {
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: 'An error has ocurred ending the turn',
            });
        }
    }

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "CardPlayed": ${payload}`,
        );

        const { card_id }: CardPlayedInterface = JSON.parse(payload);

        try {
            return await this.cardPlayedAction.handle(client, card_id);
        } catch (e) {
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: 'An error has ocurred playing a card',
            });
        }
    }
}
