import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { StatusService } from '../status.service';
import { intercept } from './constants';

@Injectable()
export class InterceptEvent {
    private readonly logger = new Logger(InterceptEvent.name);

    constructor(
        private readonly statusService: StatusService,
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
    ) {}

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                intercept,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START)
    async onPlayerTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const {
            value: {
                combatState: { statuses },
            },
        } = player;

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            player,
            intercept,
        );
    }
}
