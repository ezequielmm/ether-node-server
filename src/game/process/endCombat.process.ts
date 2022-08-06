import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from '../components/enemy/enemy.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context, ExpeditionEntity } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { restoreMap } from '../map/app';
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

    @OnEvent('entity.*')
    async handle(payload: EntityDamageEvent): Promise<void> {
        const { ctx } = payload;
        if (this.playerService.isDead(ctx)) {
            this.logger.debug('Player is dead. Ending combat');
            await this.endCombat(ctx);
            this.emitPlayerDefeated(ctx);
        } else if (this.enemyService.isAllDead(ctx)) {
            this.logger.debug('All enemies are dead. Ending combat');
            await this.endCombat(ctx);
            this.emitEnemiesDefeated(ctx);
        }
    }

    private async endCombat(ctx: Context): Promise<void> {
        const { expedition, client } = ctx;

        const map = restoreMap(expedition.map, client.id);

        map.activeNode = map.fullCurrentMap.get(expedition.currentNode.nodeId);
        map.activeNode.complete(map);

        expedition.currentNode.completed = true;
        expedition.map = map.getMap;

        await this.expeditionService.updateById(expedition._id, {
            $set: {
                map: map.getMap,
                'currentNode.completed': true,
            },
        });
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
