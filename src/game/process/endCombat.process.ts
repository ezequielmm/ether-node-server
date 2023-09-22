import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import pino from 'pino';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { NodeType } from '../components/expedition/node-type';
import { GameContext } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import {
    EVENT_AFTER_DAMAGE_EFFECT,
    EVENT_AFTER_END_COMBAT,
} from '../constants';
import { ScoreCalculatorService } from '../scoreCalculator/scoreCalculator.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { EndExpeditionProcess, ExpeditionEndingTypeEnum } from './endExpedition.process';

@Injectable()
export class EndCombatProcess {
    constructor(
        @InjectPinoLogger(EndCombatProcess.name)
        private readonly logger: PinoLogger,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly combatQueueService: CombatQueueService,
        private readonly endExpeditionProcess: EndExpeditionProcess,
    ) {}

    @OnEvent(EVENT_AFTER_DAMAGE_EFFECT)
    async handle({ ctx }: { ctx: GameContext }): Promise<void> {
        const logger = this.logger.logger.child(ctx.info);

        logger.info(
            `Checking if combat should end for client ${ctx.client.id}`,
        );
        if (this.playerService.isDead(ctx)) {
            logger.info('Player is dead. Ending combat');
            await this.emitPlayerDefeated(ctx, logger);
        }
        
        if(this.enemyService.isBossDead(ctx))
        {
            console.log("Boss defeated");
            console.log("Enemies ids in the combat:")
            ctx.expedition.currentNode.data.enemies.forEach(e => console.log(e.enemyId + " - " + e.name + " - Current HP: " + e.hpCurrent))

            logger.info('The boss is dead. Ending combat');
            await this.endCombat(ctx, logger);
        }
        else {
            if (this.enemyService.isAllDead(ctx)) {
                logger.info('All enemies are dead. Ending combat');
                await this.endCombat(ctx, logger);
            }
        }
    }

    private async endCombat(ctx: GameContext, logger: pino.Logger<pino.LoggerOptions & pino.ChildLoggerOptions>): Promise<void> {
        
        await this.combatQueueService.end(ctx);
        const isCombatBoss = ctx.expedition.currentNode.nodeSubType == NodeType.CombatBoss;

        //- End of Boss Combat:
        if (isCombatBoss) {
            ctx.expedition.currentNode.showRewards = false;
            ctx.expedition.markModified('currentNode.showRewards');

            await this.endExpeditionProcess.handle({ ctx, win: ExpeditionEndingTypeEnum.VICTORY, emit: true });
        } 
        
        //- End of normal Combat:
        else {
            ctx.expedition.currentNode.showRewards = true;
            ctx.expedition.markModified('currentNode.showRewards');
            await ctx.expedition.save();

            // message client to end combat, enemies defeated
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.EnemiesDefeated,
                    data: null,
                }),
            );
        }

        logger.info(`Combat ended for client ${ctx.client.id}`);

        await ctx.events.emitAsync(EVENT_AFTER_END_COMBAT, { ctx });
    }

    private async emitPlayerDefeated(
        ctx: GameContext,
        logger: pino.Logger<pino.LoggerOptions & pino.ChildLoggerOptions>,
    ): Promise<void> {
        await this.combatQueueService.end(ctx);
        
        ctx.expedition.currentNode.showRewards = false;
        ctx.expedition.markModified('currentNode.showRewards');

        await this.endExpeditionProcess.handle({ ctx, win: ExpeditionEndingTypeEnum.DEFEAT, emit: false });

        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EndCombat,
                action: SWARAction.PlayerDefeated,
                data: null,
            }),
        );

        logger.info(`Combat ended for client ${ctx.client.id}`);
    }
}
