import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { EVENT_BEFORE_ENEMIES_TURN_START } from 'src/game/constants';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { EffectDTO } from 'src/game/effects/effects.interface';

import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { trapped } from './constants';

@StatusDecorator({
    status: trapped,
})
@Injectable()
export class TrappedStatus implements StatusEffectHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
    ) {}

    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(
        dto: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const effectDTO = dto.effectDTO;
        effectDTO.args.currentValue =
            effectDTO.args.currentValue + 12 * dto.status.args.counter;

        return effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                trapped,
            );
        }
    }
}
