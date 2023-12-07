import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { DamageArgs } from 'src/game/effects/damage/damage.effect';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { EffectService } from 'src/game/effects/effects.service';
import { GameEvent } from 'src/game/interfaces';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { siphoning } from './constants';

@StatusDecorator({
    status: siphoning,
})
@Injectable()
export class SiphoningStatus implements StatusEffectHandler {
    constructor(
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
    ) {}

    async preview(args: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        return args.effectDTO;
    }

    async handle(dto: StatusEffectDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        
        const {ctx, effectDTO: { args, source } } = dto;

        // set the amount of defense we are going to get
        const newDefense = args.currentValue;

        // Trigger the effectService and send a defense effect
        await this.effectService.apply({
            ctx,
            source,
            target: source,
            effect: {
                effect: defenseEffect.name,
                args: {
                    value: newDefense,
                },
            },
        });

        return dto.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START)
    async onEnemiesTurnStart({ ctx }: GameEvent): Promise<void> {
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.statusService.removeStatus({
                ctx,
                entity: enemy,
                status: siphoning,
            });
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START)
    async onPlayerTurnStart({ ctx }: GameEvent): Promise<void> {
        const player = this.playerService.get(ctx);

        await this.statusService.removeStatus({
            ctx,
            entity: player,
            status: siphoning,
        });
    }
}
