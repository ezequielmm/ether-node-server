import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DataWSRequestTypesEnum } from './socket.enum';
import {
    StandardResponse,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<void> {
        this.logger.log(`Client ${client.id} trigger message "EndTurn"`);
    }

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<void> {
        this.logger.log(
            `Client ${client.id} trigger message "CardPlayed": ${payload}`,
        );
        console.log(payload);
    }

    @SubscribeMessage('GetData')
    async handleGetData(client: Socket, types: string): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "GetData": ${types}`,
        );

        let data = null;

        switch (types) {
            case DataWSRequestTypesEnum.Energy:
                data = 'Energy';
                break;

            case DataWSRequestTypesEnum.CardsPiles:
                data = 'CardsPiles';
                break;

            case DataWSRequestTypesEnum.Enemies:
                data = 'Enemies';
                break;

            case DataWSRequestTypesEnum.Players:
                data = 'Players';
                break;
        }

        return JSON.stringify(
            StandardResponse.respond({
                message_type: SWARMessageType.GenericData,
                action: types,
                data,
            }),
        );
    }
}
