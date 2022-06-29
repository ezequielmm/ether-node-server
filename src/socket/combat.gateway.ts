import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DataWSRequestTypesEnum } from './socket.enum';
import {
    StandardResponse,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { GetEnergyAction } from 'src/game/action/getEnergy.action';
import { GetCardPilesAction } from 'src/game/action/getCardPiles.action';
import { GetEnemiesAction } from 'src/game/action/getEnemies.action';
import { GetPlayerInfoAction } from 'src/game/action/getPlayerInfo.action';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);

    constructor(
        private readonly getEnergyAction: GetEnergyAction,
        private readonly getCardPilesAction: GetCardPilesAction,
        private readonly getEnemiesAction: GetEnemiesAction,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
    ) {}

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

        try {
            let data = null;

            switch (types) {
                case DataWSRequestTypesEnum.Energy:
                    data = await this.getEnergyAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.CardsPiles:
                    data = await this.getCardPilesAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.Enemies:
                    data = await this.getEnemiesAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.Players:
                    data = await this.getPlayerInfoAction.handle(client.id);
                    break;
            }

            return JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.GenericData,
                    action: types,
                    data,
                }),
            );
        } catch (e) {
            this.logger.error(e.message);
            client.emit('ErrorMessage', {
                message: `An Error has ocurred getting ${types}`,
            });
        }
    }
}
