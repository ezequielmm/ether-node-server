import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { EVENT_AFTER_DAMAGE_EFFECT } from '../constants';
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

    @OnEvent(EVENT_AFTER_DAMAGE_EFFECT, { async: true })
    async handle(ctx: Context): Promise<void> {
        if (this.playerService.isDead(ctx)) {
            this.logger.debug('Player is dead. Ending combat');
            await this.emitPlayerDefeated(ctx);
        }

        if (this.enemyService.isAllDead(ctx)) {
            this.logger.debug('All enemies are dead. Ending combat');
            await this.endCombat(ctx);
            this.emitEnemiesDefeated(ctx);
        }
    }

    private async endCombat(ctx: Context): Promise<void> {
        await this.combatQueueService.end(ctx);

        const {
            expedition: { _id: expeditionId },
        } = ctx;

        await this.expeditionService.updateById(expeditionId, {
            $set: {
                'currentNode.showRewards': true,
            },
        });

        this.logger.debug(`Combat ended for client ${ctx.client.id}`);
    }

    private emitEnemiesDefeated(ctx: Context) {
        ctx.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.EnemiesDefeated,
                    data: {
                        rewards: ctx.expedition.currentNode.data.rewards,
                    },
                }),
            ),
        );
    }

    private async emitPlayerDefeated(ctx: Context): Promise<void> {
        await this.combatQueueService.end(ctx);

        ctx.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.PlayerDefeated,
                    data: null,
                }),
            ),
        );

        await this.expeditionService.updateByFilter(
            {
                clientId: ctx.client.id,
            },
            {
                $set: {
                    status: ExpeditionStatusEnum.Defeated,
                },
            },
        );

        this.logger.debug(`Combat ended for client ${ctx.client.id}`);
    }
}
