import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_AFTER_STATUS_ATTACH,
    EVENT_BEFORE_STATUS_ATTACH,
} from 'src/game/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { nextPlayerTurnStatus } from './constants';

@StatusDecorator({
    status: nextPlayerTurnStatus,
})
@Injectable()
export class NextPlayerTurnStatus implements StatusEventHandler {
    private readonly logger: Logger = new Logger(NextPlayerTurnStatus.name);

    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async handle(dto: StatusEventDTO<Record<string, any>>): Promise<any> {
        const { ctx, source, target, status, remove } = dto;

        this.logger.debug(
            `NextPlayerTurnStatus.handle() source: ${source.value.id} target: ${target.value.id}`,
        );

        await this.eventEmitter.emitAsync(EVENT_BEFORE_STATUS_ATTACH, {
            ctx,
            source,
            target,
            status,
            targetId: target.value.id,
        });

        // Attach the status provided by the args to the target
        if (PlayerService.isPlayer(target)) {
            await this.playerService.attach(
                ctx,
                source,
                status.args.statusName,
                status.args.statusArgs,
            );
        } else if (EnemyService.isEnemy(target)) {
            await this.enemyService.attach(
                ctx,
                target.value.id,
                source,
                status.args.statusName,
                status.args.statusArgs,
            );
        }

        await this.eventEmitter.emitAsync(EVENT_AFTER_STATUS_ATTACH, {
            ctx,
            source,
            status,
            target,
            targetId: target.value.id,
        });

        remove();
    }
}
