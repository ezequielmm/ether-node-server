import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';
import { isEven } from 'src/utils';
import { TurnChangeAction } from '../actions/turnChange.action';
import { SendEnemyIntentProcess } from './sendEnemyIntent.process';

@Injectable()
export class InitCombatProcess {
    constructor(
        private readonly turnChangeAction: TurnChangeAction,
        private readonly sendEnemyIntentProcess: SendEnemyIntentProcess,
    ) {}

    async process(client: Socket): Promise<void> {
        const {
            current_node: {
                data: { round },
            },
        } = await this.turnChangeAction.handle({
            client_id: client.id,
        });

        if (!isEven(round)) this.sendEnemyIntentProcess.process(client);

        client.emit(
            'InitCombat',
            JSON.stringify(
                StandardResponse.createResponse({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.BeginCombat,
                    data: null,
                }),
            ),
        );
    }
}
