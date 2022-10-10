import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    StatusCollection,
    StatusEventDTO,
    StatusEventHandler,
} from '../interfaces';
import { resolveStatus } from '../resolve/constants';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { resolveExpiresStatus } from './constants';

@StatusDecorator({
    status: resolveExpiresStatus,
})
export class ResolveExpiresStatus implements StatusEventHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(args: StatusEventDTO): Promise<void> {
        const { ctx, status, target } = args;

        let statuses: StatusCollection;

        if (PlayerService.isPlayer(target)) {
            statuses = target.value.combatState.statuses;
        } else if (EnemyService.isEnemy(target)) {
            statuses = target.value.statuses;
        }

        for (let i = 0; i < status.args.counter; i++) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                statuses,
                target,
                resolveStatus,
            );
        }
    }
}
