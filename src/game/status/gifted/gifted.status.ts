import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { gifted } from './constants';

@StatusDecorator({
    status: gifted,
})
@Injectable()
export class GiftedStatus implements StatusEventHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
    ) {}

    async onEnemiesTurnStart(
        dto: StatusEventDTO<Record<string, any>>,
    ): Promise<any> {
        const { ctx, target, status } = dto;

        if (PlayerService.isPlayer(target)) {
            await this.playerService.setDefense(
                ctx,
                target.value.combatState.defense + status.args.value,
            );
        } else if (EnemyService.isEnemy(target)) {
            await this.enemyService.setDefense(
                ctx,
                target.value.id,
                target.value.defense + status.args.value,
            );
        }
    }
}
