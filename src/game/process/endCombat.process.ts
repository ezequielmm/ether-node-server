import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from '../components/enemy/enemy.service';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context, ExpeditionEntity } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

export interface EntityDamageEvent {
    ctx: Context;
    entity: ExpeditionEntity;
}

@Injectable()
export class EndCombatProcess {
    private readonly logger: Logger = new Logger(EndCombatProcess.name);

    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    @OnEvent('entity.*', { async: true })
    async handle(payload: EntityDamageEvent): Promise<void> {
        const { ctx } = payload;

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
    }
}
