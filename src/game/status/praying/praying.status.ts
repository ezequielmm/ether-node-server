import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { fortitude } from '../fortitude/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { resolve } from '../resolve/constants';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { prayingStatus } from './constants';

@StatusDecorator({
    status: prayingStatus,
})
@Injectable()
export class PrayingStatus implements StatusEventHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly statuService: StatusService,
    ) {}

    async handle(dto: StatusEventDTO): Promise<any> {
        const { ctx, update, remove, status, source, target } = dto;

        await this.statuService.attach({
            ctx,
            source,
            statuses: [
                {
                    name: fortitude.name,
                    args: {
                        value: 1,
                        attachTo: target.type,
                    },
                },
                {
                    name: resolve.name,
                    args: {
                        value: 1,
                        attachTo: target.type,
                    },
                },
            ],
            targetId: target.value.id,
        });

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
