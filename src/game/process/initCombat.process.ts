import { Injectable } from '@nestjs/common';
import { every } from 'lodash';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { EnemyService } from '../components/enemy/enemy.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { Node } from '../components/expedition/node';
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

    private node: Node;
    private ctx: GameContext;

    async process(
        ctx: GameContext,
        node: Node,
        continueCombat: boolean,
    ): Promise<void> {
        this.node = node;
        this.ctx = ctx;

        if (continueCombat) {
            await this.continueCombat();
        } else {
            await this.createCombat();
        }

        await this.ctx.expedition.save();
        await this.ctx.events.emitAsync(EVENT_AFTER_INIT_COMBAT, { ctx });
    }

    async createCombat(): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                this.ctx,
                this.node,
            );

        this.ctx.expedition.currentNode = currentNode;

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

        const enemiesAreDead = every(currentNode.data.enemies, {
            hpCurrent: 0,
        });

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
                    action: SWARAction.ShowRewards,
                    data: null,
                }),
            );
        } else {
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
    }
}
