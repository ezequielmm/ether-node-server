import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { EnemyService } from '../components/enemy/enemy.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionDocument } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class InitCombatProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly enemyService: EnemyService,
        private readonly expeditionService: ExpeditionService,
        private readonly setCombatTurnAction: SetCombatTurnAction,
    ) {}

    async process(client: Socket, node: IExpeditionNode): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                node,
                client.id,
            );

        const expedition = await this.expeditionService.update(client.id, {
            currentNode,
        });

        const ctx: GameContext = {
            client,
            expedition: expedition as ExpeditionDocument,
        };

        await this.setCombatTurnAction.handle({
            clientId: client.id,
            newRound: 1,
            playing: CombatTurnEnum.Player,
        });

        await this.enemyService.calculateNewIntentions(ctx);
    }
}
