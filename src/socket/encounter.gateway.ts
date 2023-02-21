import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EncounterService } from '../game/components/encounter/encounter.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

@WebSocketGateway(corsSocketSettings)
export class EncounterGateway {
    private readonly logger: Logger = new Logger(EncounterGateway.name);

    constructor(
        private readonly encounterService: EncounterService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    @SubscribeMessage('EncounterChoice')
    async handleEncounterChoice(
        client: Socket,
        choiceIdx: string,
    ): Promise<string> {
        const ctx = await this.expeditionService.getGameContext(client);

        this.logger.log(
            ctx.info,
            `Client ${client.id} trigger message "EncounterChoice" with choiceId: ${choiceIdx}`,
        );

        return await this.encounterService.encounterChoice(
            client,
            parseInt(choiceIdx),
        );
    }
}
