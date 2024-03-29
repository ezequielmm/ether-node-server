import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_END,
    EVENT_BEFORE_PLAYER_TURN_END,
} from 'src/game/constants';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectHandler, StatusEffectDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { heraldingStatus } from './constants';

@StatusDecorator({
    status: heraldingStatus,
})
@Injectable()
export class HeraldingStatus implements StatusEffectHandler {
    protected readonly logger = new Logger(HeraldingStatus.name);

    constructor(
        protected readonly playerService: PlayerService,
        protected readonly enemyService: EnemyService,
        protected readonly statusService: StatusService,
    ) {}

    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        args.effectDTO.args.currentValue *= 2;
        return args.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_END)
    async onEnemiesTurnEnd(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.decreaseCounterAndRemove(
                ctx,
                enemy.value.statuses,
                enemy,
                heraldingStatus,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async onPlayerTurnEnd(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const statuses = player.value.combatState.statuses;

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            player,
            heraldingStatus,
        );
    }
}
