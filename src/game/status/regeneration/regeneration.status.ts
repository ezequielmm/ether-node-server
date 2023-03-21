import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { healEffect } from 'src/game/effects/heal/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { regeneration } from './contants';

@StatusDecorator({
    status: regeneration,
})
@Injectable()
export class RegenerationStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const { ctx, source, target, status } = dto;

        if (
            (dto.event == EVENT_BEFORE_PLAYER_TURN_START &&
                PlayerService.isPlayer(target)) ||
            (dto.event == EVENT_BEFORE_ENEMIES_TURN_START &&
                EnemyService.isEnemy(target))
        ) {
            await this.effectService.apply({
                ctx: ctx,
                source: source,
                target: target,
                effect: {
                    effect: healEffect.name,
                    args: {
                        value: status.args.counter,
                    },
                },
            });

            // degrade by 1 each turn.
            if (status.args.counter > 1) {
                status.args.counter--;
                dto.update(status.args);
            } else {
                dto.remove();
            }
        }
    }
}
