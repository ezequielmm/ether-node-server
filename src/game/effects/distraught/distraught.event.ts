import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { filter } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { Context } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusEventHandler } from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';

@Injectable()
export class DistraughtEvent implements StatusEventHandler {
    constructor(
        private readonly statusService: StatusService,
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
    ) {}

    @OnEvent('OnBeginEnemyTurn')
    async enemyHandler(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            const statuses = enemy.value.statuses;
            const distraughtStatuses = filter(statuses.debuff, {
                name: 'distraught',
            });

            if (distraughtStatuses.length == 0) {
                continue;
            }

            for (const status of distraughtStatuses) {
                status.args.value--;
            }

            await this.statusService.updateEnemyStatuses(
                args.ctx.expedition,
                enemy,
                statuses,
            );
        }
    }

    @OnEvent('OnBeginPlayerTurn')
    async playerHandler(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);

        const statuses = player.value.combatState.statuses;
        const distraughtStatuses = filter(statuses.debuff, {
            name: 'distraught',
        });

        if (distraughtStatuses.length == 0) {
            return;
        }

        for (const status of distraughtStatuses) {
            status.args.value--;
        }

        await this.statusService.updatePlayerStatuses(
            args.ctx.expedition,
            statuses,
        );
    }
}
