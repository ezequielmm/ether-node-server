import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import { TurnChangeAction } from '../actions/turnChange.action';

@Injectable()
export class InitCombatProcess {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly turnChangeAction: TurnChangeAction,
    ) {}

    async process(client: Socket): Promise<void> {
        const { current_node } = await this.turnChangeAction.handle({
            client_id: client.id,
        });

        client.emit(
            'InitCombat',
            JSON.stringify(
                StandardResponse.createResponse({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.BeginCombat,
                    data: current_node,
                }),
            ),
        );
    }
}
