import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger, UseFilters } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EndTurnAction } from '../game/node_combat/actions/endTurn.action';
import { CardPlayedInterface } from './interfaces';
import { CardPlayedAction } from '../game/node_combat/actions/cardPlayed.action';
import { CustomExceptionFilter } from 'src/socket/customException.filter';
import { GetEnergyAction } from '../game/node_combat/actions/getEnergy.action';
import { GetPlayerHealthAction } from '../game/node_combat/actions/getPlayerHealth.action';
import { GetCardPilesAction } from '../game/node_combat/actions/getCardPiles.action';
import { DataWSRequestTypesEnum } from './enums';
import {
    StandardResponse,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';

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
        private readonly getEnergyAction: GetEnergyAction,
        private readonly getPlayerHealthAction: GetPlayerHealthAction,
        private readonly getCardPilesAction: GetCardPilesAction,
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
    async handleCardPlayed(client: Socket, payload: string): Promise<void> {
        this.logger.log(
            `Client ${client.id} trigger message "CardPlayed": ${payload}`,
        );

        const { card_id, target }: CardPlayedInterface = JSON.parse(payload);

        try {
            await this.cardPlayedAction.handle({ client, card_id, target });
        } catch (e) {
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: 'An error has ocurred playing a card',
            });
        }
    }

    /*@SubscribeMessage('GetEnergy')
    async handleGetEvent(client: Socket): Promise<number[]> {
        this.logger.log(`Client ${client.id} trigger message "GetEnergy"`);

        try {
            return await this.getEnergyAction.handle(client);
        } catch (e) {
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: 'An error has ocurred getting the card energy',
            });
        }
    }

    @SubscribeMessage('GetPlayerHealth')
    async handleGetPlayerHealth(client: Socket): Promise<number[]> {
        this.logger.log(
            `Client ${client.id} trigger message "GetPlayerHealth"`,
        );

        try {
            return await this.getPlayerHealthAction.handle(client);
        } catch (e) {
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: 'An error has ocurred getting the player health',
            });
        }
    }

    @SubscribeMessage('GetCardPiles')
    async handleGetDrawPile(client: Socket): Promise<string> {
        this.logger.log(`Client ${client.id} trigger message "GetCardPiles"`);

        try {
            return await this.getCardPilesAction.handle(client);
        } catch (e) {
            this.logger.error(e.trace);
            client.emit('ErrorMessage', {
                message: 'An error has ocurred getting the card piles',
            });
        }
    }*/

    @SubscribeMessage('GetData')
    async handleGetData(client: Socket, types: string): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "GetData": ${types}`,
        );

        let data = null;

        switch (types) {
            case DataWSRequestTypesEnum.Energy:
                data = await this.getEnergyAction.handle(client);
                break;

            case DataWSRequestTypesEnum.CardsPiles:
                data = await this.getCardPilesAction.handle(client);
                break;
        }

        return JSON.stringify(
            StandardResponse.createResponse({
                message_type: SWARMessageType.GenericData,
                action: types,
                data,
            }),
        );
    }
}
