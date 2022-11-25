import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { EnemyService } from '../components/enemy/enemy.service';
import {
    CombatTurnEnum,
    ExpeditionMapNodeStatusEnum,
} from '../components/expedition/expedition.enum';
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

    private node: IExpeditionNode;
    private client: Socket;

    async process(client: Socket, node: IExpeditionNode): Promise<void> {
        this.node = node;
        this.client = client;

        switch (this.node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                await this.createCombat();
                break;
            case ExpeditionMapNodeStatusEnum.Active:
                await this.continueCombat();
        }
    }

    async createCombat(): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                this.node,
                this.client.id,
            );

        const expedition = await this.expeditionService.update(this.client.id, {
            currentNode,
        });

        const ctx: GameContext = {
            client: this.client,
            expedition: expedition as ExpeditionDocument,
        };

        await this.setCombatTurnAction.handle({
            clientId: this.client.id,
            newRound: 1,
            playing: CombatTurnEnum.Player,
        });

        await this.enemyService.calculateNewIntentions(ctx);
    }

    async continueCombat(): Promise<void> {
        const expedition = await this.expeditionService.findOne({
            clientId: this.client.id,
        });

        const ctx: GameContext = {
            client: this.client,
            expedition: expedition as ExpeditionDocument,
        };

        await this.setCombatTurnAction.handle({
            clientId: this.client.id,
            newRound: 1,
            playing: CombatTurnEnum.Player,
        });

        await this.enemyService.calculateNewIntentions(ctx);
    }
}
