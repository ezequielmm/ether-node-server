import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from '../components/enemy/enemy.service';
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
    ) {}

    @OnEvent('entity.*')
    handle(payload: EntityDamageEvent) {
        const { ctx } = payload;
        if (this.playerService.isDead(ctx)) {
            this.logger.debug('Player is dead. Ending combat');
            this.emitPlayerDefeated(ctx);
        } else if (this.enemyService.isAllDead(ctx)) {
            this.logger.debug('All enemies are dead. Ending combat');
            this.emitEnemiesDefeated(ctx);
        }
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

    private emitPlayerDefeated(ctx: Context) {
        ctx.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.PlayerDefeated,
                    data: {},
                }),
            ),
        );
    }
}
