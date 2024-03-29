import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { fatigue } from './constants';

@StatusDecorator({
    status: fatigue,
})
@Injectable()
export class FatigueStatus implements StatusEffectHandler {
    private readonly logger = new Logger(FatigueStatus.name);
    constructor(
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
    ) {}

    preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(args);
    }

    async handle(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        const damage = Math.floor(args.effectDTO.args.currentValue * 0.75);
        this.logger.log(
            args.ctx.info,
            `Reducing damage by 25% due to ${fatigue.name} from ${args.effectDTO.args.currentValue} to ${damage}`,
        );

        args.effectDTO.args.currentValue = damage;
        return args.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart({ ctx }: { ctx: GameContext }): Promise<void> {
        const enemies = this.enemyService.getLiving(ctx);

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                fatigue,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START)
    async onPlayerTurnStart({ ctx }: { ctx: GameContext }): Promise<void> {
        const player = this.playerService.get(ctx);
        const {
            value: {
                combatState: { statuses },
            },
        } = player;

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            player,
            fatigue,
        );
    }
}
