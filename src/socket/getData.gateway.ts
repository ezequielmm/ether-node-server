import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetCardPilesAction } from 'src/game/action/getCardPiles.action';
import { GetCurrentStepAction } from 'src/game/action/getCurrentStep.action';
import { GetEnemiesAction } from 'src/game/action/getEnemies.action';
import { GetEnergyAction } from 'src/game/action/getEnergy.action';
import { GetMerchantDataAction } from 'src/game/action/getMerchantData.action';
import { GetPlayerDeckAction } from 'src/game/action/getPlayerDeck.action';
import { GetPlayerInfoAction } from 'src/game/action/getPlayerInfo.action';
import { GetRewardsAction } from 'src/game/action/getRewards.action';
import { GetStatusesAction } from 'src/game/action/getStatuses.action';
import { GetTreasureDataAction } from 'src/game/action/getTreasureData.action';
import { GetUpgradableCardsAction } from 'src/game/action/getUpgradableCards.action';
import { SendEnemyIntentProcess } from 'src/game/process/sendEnemyIntents.process';
import {
    StandardResponse,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { corsSocketSettings, DataWSRequestTypesEnum } from './socket.enum';
import { GetEncounterDataAction } from 'src/game/action/getEncounterDataAction';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';

@WebSocketGateway(corsSocketSettings)
export class GetDataGateway {
    constructor(
        @InjectPinoLogger(GetDataGateway.name)
        private readonly logger: PinoLogger,
        private readonly sendEnemyIntentsProcess: SendEnemyIntentProcess,
        private readonly getPlayerDeckAction: GetPlayerDeckAction,
        private readonly getStatusesAction: GetStatusesAction,
        private readonly getEnergyAction: GetEnergyAction,
        private readonly getCardPilesAction: GetCardPilesAction,
        private readonly getEnemiesAction: GetEnemiesAction,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
        private readonly getCurrentStepAction: GetCurrentStepAction,
        private readonly getUpgradableCards: GetUpgradableCardsAction,
        private readonly getMerchantDataAction: GetMerchantDataAction,
        private readonly getTreasureDataAction: GetTreasureDataAction,
        private readonly getRewardsAction: GetRewardsAction,
        private readonly getEncounterAction: GetEncounterDataAction,
        private readonly expeditionService: ExpeditionService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('GetData')
    async handleGetData(client: Socket, types: string): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<GETDATA: ' + types + '>');

                const ctx = await this.expeditionService.getGameContext(client);

                const logger = this.logger.logger.child(ctx.info);

                logger.info(
                    `Client ${client.id} trigger message "GetData": ${types}`,
                );

                try {
                    let data = null;

                    switch (types) {
                        case DataWSRequestTypesEnum.Energy:
                            data = await this.getEnergyAction.handle(client.id);
                            break;

                        case DataWSRequestTypesEnum.CardsPiles:
                            data = await this.getCardPilesAction.handle(
                                client.id,
                            );
                            break;

                        case DataWSRequestTypesEnum.Enemies:
                            data = await this.getEnemiesAction.handle(
                                client.id,
                            );
                            break;

                        case DataWSRequestTypesEnum.Players:
                            data = await this.getPlayerInfoAction.handle(
                                client.id,
                            );
                            break;

                        case DataWSRequestTypesEnum.Statuses:
                            data = await this.getStatusesAction.handle(
                                client.id,
                            );
                            break;

                        case DataWSRequestTypesEnum.EnemyIntents:
                            data = await this.sendEnemyIntentsProcess.handle(
                                ctx,
                            );
                            break;

                        case DataWSRequestTypesEnum.PlayerDeck:
                            data = await this.getPlayerDeckAction.handle(
                                client.id,
                            );
                            break;

                        case DataWSRequestTypesEnum.CurrentNode:
                            data = await this.getCurrentStepAction.handle(ctx);
                            break;

                        case DataWSRequestTypesEnum.UpgradableCards:
                            data = await this.getUpgradableCards.handle(
                                client.id,
                            );
                            break;

                        case DataWSRequestTypesEnum.MerchantData:
                            data = await this.getMerchantDataAction.handle(
                                client.id,
                            );
                            break;

                        case DataWSRequestTypesEnum.TreasureData:
                            data = await this.getTreasureDataAction.handle(
                                client,
                            );
                            break;

                        case DataWSRequestTypesEnum.Rewards:
                            data = await this.getRewardsAction.handle(
                                client.id,
                            );
                            break;

                        case DataWSRequestTypesEnum.EncounterData:
                            data = await this.getEncounterAction.handle(client);
                            break;
                    }

                    client.emit(
                        'PutData',
                        StandardResponse.respond({
                            message_type: SWARMessageType.GenericData,
                            action: types,
                            data,
                        }),
                    );
                } catch (e) {
                    logger.error(ctx.info, e.message);
                    logger.error(ctx.info, e.trace);

                    client.emit('ErrorMessage', {
                        message: `An Error has ocurred getting ${types}`,
                    });
                }

                this.logger.debug('</GETDATA: ' + types + '>');
            },
        );
    }
}
