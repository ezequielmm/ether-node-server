import { Injectable } from '@nestjs/common';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { EnemyService } from '../components/enemy/enemy.service';
import {
    CombatTurnEnum,
    ExpeditionMapNodeStatusEnum,
} from '../components/expedition/expedition.enum';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { EVENT_AFTER_INIT_COMBAT } from '../constants';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
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
    private ctx: GameContext;

    async process(ctx: GameContext, node: IExpeditionNode): Promise<void> {
        this.node = node;
        this.ctx = ctx;

        switch (this.node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                await this.createCombat();
                break;
            case ExpeditionMapNodeStatusEnum.Active:
                await this.continueCombat();
        }

        await this.ctx.events.emitAsync(EVENT_AFTER_INIT_COMBAT, { ctx });
    }

    async createCombat(): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                this.ctx,
                this.node,
            );

        this.ctx.expedition.currentNode = currentNode;
        await this.ctx.expedition.save();

        await this.setCombatTurnAction.handle({
            clientId: this.ctx.client.id,
            newRound: 1,
            playing: CombatTurnEnum.Player,
        });

        await this.enemyService.calculateNewIntentions(this.ctx);

        this.ctx.client.emit(
            'InitCombat',
            StandardResponse.respond({
                message_type: SWARMessageType.CombatUpdate,
                action: SWARAction.BeginCombat,
                data: null,
            }),
        );
    }

    async continueCombat(): Promise<void> {
        const expedition = await this.expeditionService.findOne({
            clientId: this.ctx.client.id,
        });

        const expeditionId = expedition._id.toString();
        const { currentNode } = expedition;

        const enemiesAreDead = currentNode.data.enemies.every(
            (enemy) => enemy.hpCurrent === 0,
        );

        if (enemiesAreDead) {
            await this.expeditionService.updateById(expeditionId, {
                $set: {
                    'currentNode.showRewards': true,
                },
            });

            this.ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.EnemiesDefeated,
                    data: {
                        rewards: currentNode.data.rewards,
                    },
                }),
            );
        } else {
            await this.setCombatTurnAction.handle({
                clientId: this.ctx.client.id,
                newRound: 1,
                playing: CombatTurnEnum.Player,
            });

            await this.enemyService.calculateNewIntentions(this.ctx);
        }

        this.ctx.client.emit(
            'InitCombat',
            StandardResponse.respond({
                message_type: SWARMessageType.CombatUpdate,
                action: SWARAction.BeginCombat,
                data: null,
            }),
        );
    }
}
