import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetCardPilesAction } from 'src/game/action/getCardPiles.action';
import { GetCurrentStepAction } from 'src/game/action/getCurrentStep.action';
import { GetEnemiesAction } from 'src/game/action/getEnemies.action';
import { GetEnergyAction } from 'src/game/action/getEnergy.action';
import { GetPlayerDeckAction } from 'src/game/action/getPlayerDeck.action';
import { GetPlayerInfoAction } from 'src/game/action/getPlayerInfo.action';
import { GetStatusesAction } from 'src/game/action/getStatuses.action';
import { SendEnemyIntentProcess } from 'src/game/process/sendEnemyIntents.process';
import {
    StandardResponse,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { DataWSRequestTypesEnum } from './socket.enum';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GetDataGateway {
    private readonly logger: Logger = new Logger(GetDataGateway.name);

    constructor(
        private readonly sendEnemyIntentsProcess: SendEnemyIntentProcess,
        private readonly getPlayerDeckAction: GetPlayerDeckAction,
        private readonly getStatusesAction: GetStatusesAction,
        private readonly getEnergyAction: GetEnergyAction,
        private readonly getCardPilesAction: GetCardPilesAction,
        private readonly getEnemiesAction: GetEnemiesAction,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
        private readonly getCurrentStepAction: GetCurrentStepAction,
    ) {}

    @SubscribeMessage('GetData')
    async handleGetData(client: Socket, types: string): Promise<string> {
        this.logger.debug(
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

                case DataWSRequestTypesEnum.Statuses:
                    data = await this.getStatusesAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.EnemyIntents:
                    data = await this.sendEnemyIntentsProcess.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.PlayerDeck:
                    data = await this.getPlayerDeckAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.CurrentNode:
                    data = await this.getCurrentStepAction.handle(client.id);
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
