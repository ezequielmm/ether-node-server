import { Injectable, Logger } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { anticipatingStatus } from 'src/game/status/anticipating/constants';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { anticipatingEffect } from './constants';

@EffectDecorator({
    effect: anticipatingEffect,
})
@Injectable()
export class AnticipatingEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(AnticipatingEffect.name);

    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx, source, target } = dto;

        let defense: number;

        if (PlayerService.isPlayer(target)) {
            defense = target.value.combatState.defense;
        } else if (EnemyService.isEnemy(target)) {
            defense = target.value.defense;
        }

        this.logger.debug(
            `Adding anticipating status to ${target.type} with ${defense} defense`,
        );

        await this.statusService.attach({
            ctx,
            source,
            statuses: [
                {
                    name: anticipatingStatus.name,
                    args: {
                        attachTo: target.type,
                        value: defense,
                    },
                },
            ],
            targetId: target.value.id,
        });
    }
}
