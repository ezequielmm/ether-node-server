import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { isEven } from 'src/utils';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Injectable()
export class InitCombatProcess {
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
            playing: CombatTurnEnum.Player,
        });

        if (!isEven(round)) this.sendEnemyIntentProcess.process(client);
    }
}
