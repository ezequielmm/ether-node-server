import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { fortitude } from '../fortitude/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { resolve } from '../resolve/constants';
import { StatusDecorator } from '../status.decorator';
import { prayingStatus } from './constants';

@StatusDecorator({
    status: prayingStatus,
})
@Injectable()
export class PrayingStatus implements StatusEventHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(dto: StatusEventDTO): Promise<any> {
        const { ctx, update, remove, status, target } = dto;

        if (PlayerService.isPlayer(target)) {
            await this.playerService.attach(ctx, target, resolve.name);
            await this.playerService.attach(ctx, target, fortitude.name);
        } else if (EnemyService.isEnemy(target)) {
            const id = target.value.id;
            await this.enemyService.attach(ctx, id, target, resolve.name);
            await this.enemyService.attach(ctx, id, target, fortitude.name);
        }

        // Decrease counter
        status.args.value--;

        // Remove status if counter is 0
        if (status.args.value === 0) {
            remove();
        } else {
            update(status.args);
        }
    }
}
