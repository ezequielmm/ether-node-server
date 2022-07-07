import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
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
                data: { playing },
            },
        } = await this.setCombatTurnAction.handle({
            clientId: client.id,
            newRound: 1,
            playing: CombatTurnEnum.Player,
        });

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.ChangeTurn}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.BeginTurn,
                    action: SWARAction.ChangeTurn,
                    data: CombatTurnEnum.Player,
                }),
            ),
        );

        if (playing === CombatTurnEnum.Player)
            this.sendEnemyIntentProcess.process(client);
    }
}
