import { Injectable } from '@nestjs/common';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { confusion } from 'src/game/status/confusion/constants';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { headButt } from './constants';

@EffectDecorator({
    effect: headButt,
})
@Injectable()
export class HeadButtEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { target, source, ctx } = dto;

        let defense = 0;

        if (EnemyService.isEnemy(target)) {
            defense = target.value.defense;
        } else if (PlayerService.isPlayer(target)) {
            defense = target.value.combatState.defense;
        }

        if (defense === 0) {
            await this.statusService.attach({
                ctx,
                source,
                target,
                statusName: confusion.name,
                statusArgs: {
                    counter: 1,
                },
            });
        }
    }
}
