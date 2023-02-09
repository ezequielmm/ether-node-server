import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EncounterService } from '../game/components/encounter/encounter.service';

@WebSocketGateway(corsSocketSettings)
export class EncounterGateway {
    private readonly logger: Logger = new Logger(EncounterGateway.name);

    constructor(private readonly encounterService: EncounterService) {}

    @SubscribeMessage('EncounterChoice')
    async handleEncounterChoice(
        client: Socket,
        choiceIdx: string,
    ): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "EncounterChoice"`,
        );

        return await this.encounterService.encounterChoice(
            client,
            parseInt(choiceIdx),
        );
    }
}
