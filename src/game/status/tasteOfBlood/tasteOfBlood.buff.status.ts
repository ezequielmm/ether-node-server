import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GameContext } from 'src/game/components/interfaces';
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { HeraldingStatus } from '../heralding/heralding.status';
import { StatusDecorator } from '../status.decorator';
import { tasteOfBloodBuff } from './constants';

/**
 * Taste of Blood buff.
 *
 * @description
 * This status is a buff that increases the damage of the next damage effect.
 * Note that it extends from HeraldDelayedStatus, it has the same behavior.
 */
@StatusDecorator({
    status: tasteOfBloodBuff,
})
@Injectable()
export class TasteOfBloodBuffStatus extends HeraldingStatus {
    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnEnd(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                tasteOfBloodBuff,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START)
    async onPlayerTurnEnd(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const statuses = player.value.combatState.statuses;

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            player,
            tasteOfBloodBuff,
        );
    }
}
