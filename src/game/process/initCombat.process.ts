import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { isEven } from 'src/utils';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Injectable()
export class InitCombatProcess {
    private readonly logger: Logger = new Logger(InitCombatProcess.name);

    constructor(
        private readonly setCombatTurnAction: SetCombatTurnAction,
        private readonly sendEnemyIntentProcess: SendEnemyIntentProcess,
    ) {}

    async process(client: Socket): Promise<void> {
        const {
            currentNode: {
                data: { round },
            },
        } = await this.setCombatTurnAction.handle({
            clientId: client.id,
            newRound: 1,
        });

        if (!isEven(round)) this.sendEnemyIntentProcess.process(client);

        this.logger.log(`Sent message "InitCombat" to client ${client.id}`);

        client.emit(
            'InitCombat',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.BeginCombat,
                    data: null,
                }),
            ),
        );
    }
}
