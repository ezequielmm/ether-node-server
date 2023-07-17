import { Injectable } from '@nestjs/common';
import { every } from 'lodash';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { EnemyService } from '../components/enemy/enemy.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { Node } from '../components/expedition/node';
import { GameContext } from '../components/interfaces';
import {
    EVENT_AFTER_CREATE_COMBAT,
    EVENT_AFTER_INIT_COMBAT,
} from '../constants';
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
        private readonly setCombatTurnAction: SetCombatTurnAction,
    ) {}

    async process(
        ctx: GameContext,
        node: Node,
        continueCombat: boolean,
    ): Promise<void> {
        if (continueCombat) {
            await this.continueCombat(ctx);
        } else {
            await this.createCombat(ctx, node);
            // Combat is initialized, emit event
            await ctx.events.emitAsync(EVENT_AFTER_INIT_COMBAT, { ctx });
        }

        await ctx.expedition.save();
    }

    async createCombat(ctx: GameContext, node: Node): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                ctx,
                node,
            );

        ctx.expedition.currentNode = currentNode;

        // Combat is created, emit event
        await ctx.events.emitAsync(EVENT_AFTER_CREATE_COMBAT, { ctx });

        await this.setCombatTurnAction.handle({
            clientId: ctx.client.id,
            newRound: 1,
            playing: CombatTurnEnum.Player,
        });

        await this.enemyService.calculateNewIntentions(ctx);

        ctx.client.emit(
            'InitCombat',
            StandardResponse.respond({
                message_type: SWARMessageType.CombatUpdate,
                action: SWARAction.BeginCombat,
                data: null,
            }),
        );
    }

    async continueCombat(ctx: GameContext): Promise<void> {
        const enemiesAreDead = every(ctx.expedition.currentNode.data.enemies, {
            hpCurrent: 0,
        });

        if (enemiesAreDead) {
            ctx.expedition.currentNode.showRewards = true;

            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.ShowRewards,
                    data: null,
                }),
            );
        } else {
            await this.setCombatTurnAction.handle({
                clientId: ctx.client.id,
                newRound: 1,
                playing: CombatTurnEnum.Player,
            });

            ctx.client.emit(
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
