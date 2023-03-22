import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import pino from 'pino';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
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
import { GearService } from '../components/gear/gear.service';
import { PlayerWinService } from '../../playerWin/playerWin.service';
import { ContestService } from '../contest/contest.service';

@Injectable()
export class EndCombatProcess {
    constructor(
        @InjectPinoLogger(EndCombatProcess.name)
        private readonly logger: PinoLogger,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly expeditionService: ExpeditionService,
        private readonly combatQueueService: CombatQueueService,
        private readonly scoreCalculatorService: ScoreCalculatorService,
        private readonly gearService: GearService,
        private readonly playerWinService: PlayerWinService,
        private readonly contestService: ContestService,
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

        if (this.enemyService.isAllDead(ctx)) {
            logger.info('All enemies are dead. Ending combat');
            await this.endCombat(ctx, logger);
        }
    }

    private async endCombat(
        ctx: GameContext,
        logger: pino.Logger<pino.LoggerOptions & pino.ChildLoggerOptions>,
    ): Promise<void> {
        await this.combatQueueService.end(ctx);

        const isCombatBoss =
            ctx.expedition.currentNode.nodeSubType == NodeType.CombatBoss;

        // If combat boss, update expedition status to victory
        // and emit show score
        if (isCombatBoss) {
            const score = this.scoreCalculatorService.calculate({
                expedition: ctx.expedition,
            });

            ctx.expedition.status = ExpeditionStatusEnum.Victory;
            ctx.expedition.finalScore = score;
            ctx.expedition.completedAt = new Date();
            ctx.expedition.endedAt = new Date();

            const isContestValid = await this.contestService.isValid(
                ctx.expedition.contest,
            );

            if (isContestValid) {
                ctx.expedition.finalScore.lootbox =
                    await this.gearService.getLootbox(
                        3,
                        ctx.expedition.playerState.lootboxRarity,
                    );
                ctx.expedition.finalScore.notifyNoLoot = false;
            } else {
                ctx.expedition.finalScore.lootbox = [];
                ctx.expedition.finalScore.notifyNoLoot = true;
            }

            await this.playerWinService.create({
                event_id: ctx.expedition.contest.event_id,
                playerToken: ctx.expedition.playerState.playerToken,
            });

            //message client
            ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.ShowScore,
                    data: null,
                }),
            );
        }

        ctx.expedition.currentNode.showRewards = true;
        ctx.expedition.markModified('currentNode.showRewards');

        await ctx.expedition.save();

        // If not combat boss, emit enemies defeated
        if (!isCombatBoss) {
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

        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EndCombat,
                action: SWARAction.PlayerDefeated,
                data: null,
            }),
        );

        const score = this.scoreCalculatorService.calculate({
            expedition: ctx.expedition,
        });

        ctx.expedition.status = ExpeditionStatusEnum.Defeated;
        ctx.expedition.finalScore = score;
        ctx.expedition.isCurrentlyPlaying = false;
        ctx.expedition.defeatedAt = new Date();
        ctx.expedition.endedAt = new Date();

        await ctx.expedition.save();

        logger.info(`Combat ended for client ${ctx.client.id}`);
    }
}
