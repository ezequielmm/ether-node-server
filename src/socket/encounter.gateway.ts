import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { corsSocketSettings } from './socket.enum';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { StandardResponse, SWARAction, SWARMessageType } from '../game/standardResponse/standardResponse';

@WebSocketGateway(corsSocketSettings)
export class EncounterGateway {
    private readonly logger: Logger = new Logger(EncounterGateway.name);

    @SubscribeMessage('EncounterChoice')
    async handleEncounterChoice(
        client: Socket,
        rewardId: string,
    ): Promise<string> {
        return StandardResponse.respond({
            message_type: SWARMessageType.GenericData,
            action: SWARAction.BeginEncounter,
            data: {},
        });
    }
}
