import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EndTurnAction } from '../game/node_combat/actions/endTurn.action';
import { CardPlayedInterface } from './interfaces';
import { CardPlayedAction } from '../game/node_combat/actions/cardPlayed.action';
import { GetEnergyAction } from '../game/node_combat/actions/getEnergy.action';
import { GetCardPilesAction } from '../game/node_combat/actions/getCardPiles.action';
import { DataWSRequestTypesEnum } from './enums';
import {
    StandardResponse,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { GetEnemiesAction } from 'src/game/node_combat/actions/getEnemies.action';
import { GetPlayerInfoAction } from 'src/game/node_combat/actions/getPlayerInfo.action';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);

    constructor(
        private readonly endTurnAction: EndTurnAction,
        private readonly cardPlayedAction: CardPlayedAction,
        private readonly getEnergyAction: GetEnergyAction,
        private readonly getCardPilesAction: GetCardPilesAction,
        private readonly getEnemiesAction: GetEnemiesAction,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
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

        await this.cardPlayedAction.handle({ client, card_id, target });
    }

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

            case DataWSRequestTypesEnum.Enemies:
                data = await this.getEnemiesAction.handle(client);
                break;

            case DataWSRequestTypesEnum.Players:
                data = await this.getPlayerInfoAction.handle(client);
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
