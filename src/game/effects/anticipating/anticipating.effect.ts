import { Injectable, Logger } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { anticipatingStatus } from 'src/game/status/anticipating/constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { anticipatingEffect } from './constants';

@EffectDecorator({
    effect: anticipatingEffect,
})
@Injectable()
export class AnticipatingEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(AnticipatingEffect.name);

    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx, source, target } = dto;
        if (PlayerService.isPlayer(target)) {
            const defense = target.value.combatState.defense;
            this.logger.debug(
                `Adding anticipating status to player with ${defense} defense`,
            );
            await this.playerService.attach(
                ctx,
                source,
                anticipatingStatus.name,
                {
                    value: defense,
                },
            );
        } else if (EnemyService.isEnemy(target)) {
            const defense = target.value.defense;
            this.logger.debug(
                `Adding anticipating status to enemy with ${defense} defense`,
            );
            await this.enemyService.attach(
                ctx,
                target.value.id,
                source,
                anticipatingStatus.name,
                {
                    value: defense,
                },
            );
        }
    }
}
