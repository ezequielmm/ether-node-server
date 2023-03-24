import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import { UpgradeCardService } from 'src/game/upgradeCard/upgradeCard.service';
import { corsSocketSettings } from './socket.enum';
import { EncounterService } from '../game/components/encounter/encounter.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';

export enum UpgradeCardNodeTypes {
    Encounter = 'encounter',
    Camp = 'camp',
}

@WebSocketGateway(corsSocketSettings)
export class UpgradeCardGateway {
    private readonly logger: Logger = new Logger(UpgradeCardGateway.name);

    constructor(
        private readonly upgradeCardService: UpgradeCardService,
        private readonly encounterService: EncounterService,
        private readonly expeditionService: ExpeditionService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('CardUpgradeSelected')
    async handleCardUpgradeSelected(
        client: Socket,
        cardId: string,
    ): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<UPGRADE SELECTED>');
                const ctx = await this.expeditionService.getGameContext(client);

                this.logger.log(
                    ctx.info,
                    `Client ${client.id} trigger message "CardUpgradeSelected": cardId: ${cardId}`,
                );

                try {
                    client.emit(
                        'CardUpgradeSelectedResponse',
                        await this.upgradeCardService.showUpgradablePair(client, cardId),
                    );
                } catch (e) {
                    this.logger.error(e);
                    client.emit('ErrorMessage', {
                        message: e.message ?? 'An Error has occurred finding the upgraded card.',
                    });
                }
                
                this.logger.debug('<UPGRADE SELECTED>');
            }
        );
    }

    @SubscribeMessage('UpgradeCard')
    async handleUpgradeCard(client: Socket, cardId: string): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<UPGRADE CARD>');
                const ctx = await this.expeditionService.getGameContext(client);

                this.logger.log(
                    ctx.info,
                    `Client ${client.id} trigger message "UpgradeCard": cardId: ${cardId}`,
                );

                const response = await this.upgradeCardService.upgradeCard(
                    client,
                    cardId,
                );

                const upgradeLocation = (await this.encounterService.getEncounterData(client)) 
                                        ? UpgradeCardNodeTypes.Encounter 
                                        : UpgradeCardNodeTypes.Camp;

                switch (upgradeLocation) {
                    case UpgradeCardNodeTypes.Encounter:
                        await this.encounterService.handleUpgradeCard(client, cardId);
                        break;
                    case UpgradeCardNodeTypes.Camp:
                    default:
                        client.emit(
                            'PutData',
                            StandardResponse.respond({
                                message_type: SWARMessageType.CampUpdate,
                                action: SWARAction.FinishCamp,
                                data: null,
                            }),
                        );
                        break;
                }

                client.emit(
                    'UpgradeCardResponse',
                    response
                );

                // TODO: add validation to confirm if the user can upgrade more cards
                this.logger.debug('<UPGRADE CARD>');
            }
        );
    }
}
