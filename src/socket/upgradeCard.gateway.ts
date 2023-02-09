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

@WebSocketGateway(corsSocketSettings)
export class UpgradeCardGateway {
    private readonly logger: Logger = new Logger(UpgradeCardGateway.name);

    constructor(
        private readonly upgradeCardService: UpgradeCardService,
        private readonly encounterService: EncounterService,
    ) {}

    @SubscribeMessage('CardUpgradeSelected')
    async handleCardUpgradeSelected(
        client: Socket,
        cardId: string,
    ): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "CardUpgradeSelected": cardId: ${cardId}`,
        );

        return await this.upgradeCardService.showUpgradablePair(client, cardId);
    }

    @SubscribeMessage('UpgradeCard')
    async handleUpgradeCard(client: Socket, cardId: string): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "UpgradeCard": cardId: ${cardId}`,
        );

        const response = await this.upgradeCardService.upgradeCard(
            client,
            cardId,
        );

        const encounterData = await this.encounterService.getEncounterData(
            client,
        );
        if (encounterData) {
            await this.encounterService.handleUpgradeCard(client, cardId);
            return response;
        }

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.CampUpdate,
                action: SWARAction.FinishCamp,
                data: null,
            }),
        );

        return response;

        // TODO: add validation to confirm if the user can upgrade more cards
    }
}
