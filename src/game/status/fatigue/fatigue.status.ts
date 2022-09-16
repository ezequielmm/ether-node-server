import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { Context } from 'src/game/components/interfaces';
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
        this.logger.debug(
            `Reducing damage by 25% due to ${fatigue.name} from ${
                args.effectDTO.args.currentValue
            } to ${Math.floor(args.effectDTO.args.currentValue * 0.75)}`,
        );

        args.effectDTO.args.currentValue = Math.floor(
            args.effectDTO.args.currentValue * 0.75,
        );
        return args.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START, { async: true })
    async onEnemiesTurnStart(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                fatigue,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START, { async: true })
    async onPlayerTurnStart(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
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
