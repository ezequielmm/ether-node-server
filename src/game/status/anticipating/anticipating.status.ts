import { Injectable, Logger } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { anticipatingStatus } from './constants';

@StatusDecorator({
    status: anticipatingStatus,
})
@Injectable()
export class AnticipatingStatus implements StatusEventHandler {
    private readonly logger: Logger = new Logger(AnticipatingStatus.name);

    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
    ) {}

    async onEnemiesTurnStart(dto: StatusEventDTO): Promise<any> {
        const { ctx, status, target } = dto;

        this.logger.debug(
            `Restoring ${status.args.value} defense to ${target.type}`,
        );

        if (PlayerService.isPlayer(target)) {
            await this.playerService.setDefense(ctx, status.args.value);
        } else if (EnemyService.isEnemy(target)) {
            await this.enemyService.setDefense(
                ctx,
                target.value.id,
                status.args.value,
            );
        }

        dto.remove();
    }
}
