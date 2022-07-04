import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { isEven } from 'src/utils';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Injectable()
export class InitCombatProcess {
    private readonly logger: Logger = new Logger(InitCombatProcess.name);

    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly sendEnemyIntentProcess: SendEnemyIntentProcess,
        private readonly setCombatTurnAction: SetCombatTurnAction,
    ) {}

    async process(client: Socket, node: IExpeditionNode): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                node,
                client.id,
            );

        await this.expeditionService.update(client.id, {
            currentNode,
        });

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
