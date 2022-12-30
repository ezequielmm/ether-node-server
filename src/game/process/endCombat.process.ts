import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { EVENT_AFTER_DAMAGE_EFFECT, EVENT_AFTER_END_COMBAT } from '../constants';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

@Injectable()
export class EndCombatProcess {
    private readonly logger: Logger = new Logger(EndCombatProcess.name);

    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly expeditionService: ExpeditionService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    @OnEvent(EVENT_AFTER_DAMAGE_EFFECT)
    async handle({ ctx }): Promise<void> {
        if (this.playerService.isDead(ctx)) {
            this.logger.debug('Player is dead. Ending combat');
            await this.emitPlayerDefeated(ctx);
        }

        if (this.enemyService.isAllDead(ctx)) {
            this.logger.debug('All enemies are dead. Ending combat');
            await this.endCombat(ctx);
        }
    }

    private async endCombat(ctx: GameContext): Promise<void> {
        await this.combatQueueService.end(ctx);

        await this.expeditionService.updateById(ctx.expedition._id.toString(), {
            $set: {
                'currentNode.showRewards': true,
            },
        });

        this.logger.debug(`Combat ended for client ${ctx.client.id}`);

        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EndCombat,
                action: SWARAction.EnemiesDefeated,
                data: null,
            }),
        );

        ctx.events.emit(EVENT_AFTER_END_COMBAT, { ctx });
    }

    private async emitPlayerDefeated(ctx: GameContext): Promise<void> {
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
                },
            },
        );

        this.logger.debug(`Combat ended for client ${ctx.client.id}`);
    }
}
