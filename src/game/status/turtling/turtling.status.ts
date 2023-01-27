import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { StatusEventHandler, StatusEventDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { turtling } from './constants';

@StatusDecorator({
    status: turtling,
})
export class TurtlingStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: StatusEventDTO<Record<string, any>>): Promise<any> {
        const { ctx, target, status, update, remove } = dto;

        let defense: number;
        if (PlayerService.isPlayer(target)) {
            defense = target.value.combatState.defense;
        } else if (EnemyService.isEnemy(target)) {
            defense = target.value.defense;
        }

        await this.effectService.apply({
            ctx: ctx,
            source: target,
            target: target,
            effect: {
                effect: defenseEffect.name,
                args: {
                    value: defense,
                },
            },
        });

        status.args.counter--;

        if (status.args.counter <= 0) {
            remove();
        } else {
            update({
                counter: status.args.counter,
            });
        }
    }
}
