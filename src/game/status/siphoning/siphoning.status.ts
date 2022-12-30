import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { confusion } from '../confusion/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { siphoning } from './constants';

@StatusDecorator({
    status: siphoning,
})
@Injectable()
export class SiphoningStatus implements StatusEventHandler {
    constructor(
        private readonly effectService: EffectService,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly statusService: StatusService,
    ) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        if (dto.target.type === CardTargetedEnum.Enemy)
            await this.effectService.apply({
                ctx: dto.ctx,
                source: dto.source,
                target: dto.target,
                effect: {
                    effect: defenseEffect.name,
                    args: {
                        value: dto.eventArgs.damageDealt,
                    },
                },
            });
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
                confusion,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START)
    async onPlayerTurnStart(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const statuses = player.value.combatState.statuses;

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            player,
            siphoning,
        );
    }
}
