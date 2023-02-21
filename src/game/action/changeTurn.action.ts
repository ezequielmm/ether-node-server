import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';

@Injectable()
export class ChangeTurnAction {
    private readonly logger: Logger = new Logger(ChangeTurnAction.name);

    handle({
        client,
        type,
        entity,
    }: {
        client: Socket;
        type: SWARMessageType.BeginTurn | SWARMessageType.EndTurn;
        entity: CombatTurnEnum;
    }): void {
        this.logger.log(
            `Sent message PutData to client ${client.id} - type: ${type}, action: ${SWARAction.ChangeTurn}, data: ${entity}`,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: type,
                action: SWARAction.ChangeTurn,
                data: entity,
            }),
        );
    }
}
