import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EncounterService } from '../game/components/encounter/encounter.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';

@WebSocketGateway(corsSocketSettings)
export class EncounterGateway {
    private readonly logger: Logger = new Logger(EncounterGateway.name);

    constructor(
        private readonly encounterService: EncounterService,
        private readonly expeditionService: ExpeditionService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('EncounterChoice')
    async handleEncounterChoice(
        client: Socket,
        choiceIdx: string,
    ): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<ENCOUNTER CHOICE>');
                const ctx = await this.expeditionService.getGameContext(client);

                this.logger.log(
                    ctx.info,
                    `Client ${client.id} trigger message "EncounterChoice" with choiceId: ${choiceIdx}`,
                );

                ctx.client.emit(
                    'EncounterChoiceResponse',
                    await this.encounterService.encounterChoice(
                        client,
                        parseInt(choiceIdx),
                    ),
                );

                this.logger.debug('</ENCOUNTER CHOICE>');
            }
        );
    }
}
