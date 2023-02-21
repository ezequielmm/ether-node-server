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
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

@Injectable()
export class EndCombatProcess {
    constructor(
        @InjectPinoLogger(EndCombatProcess.name)
        private readonly logger: PinoLogger,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly expeditionService: ExpeditionService,
        private readonly combatQueueService: CombatQueueService,
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
            ctx.expedition.status = ExpeditionStatusEnum.Victory;
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

        await this.expeditionService.updateByFilter(
            {
                clientId: ctx.client.id,
            },
            {
                $set: {
                    status: ExpeditionStatusEnum.Defeated,
                    isCurrentlyPlaying: false,
                    defeatedAt: new Date(),
                },
            },
        );

        logger.info(`Combat ended for client ${ctx.client.id}`);
    }
}
