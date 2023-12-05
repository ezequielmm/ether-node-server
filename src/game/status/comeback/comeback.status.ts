import { Injectable } from '@nestjs/common';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { comebackStatus } from './constants';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusService } from '../status.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { damageEffect } from 'src/game/effects/damage/constants';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { EVENT_BEFORE_PLAYER_TURN_START } from 'src/game/constants';
import { OnEvent } from '@nestjs/event-emitter';


@StatusDecorator({
    status: comebackStatus,
})
@Injectable()
export class ComebackStatus implements StatusEventHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
        private readonly effectService: EffectService,
        private readonly enemyService: EnemyService,
        private readonly combatQueueService: CombatQueueService,


    ) { }

    async handle(dto: StatusEventDTO): Promise<void> {

        const { ctx, source } = dto;
        const player = this.playerService.get(ctx);
        const target = this.enemyService.getRandom(ctx);
        const playerDefense = player.value.combatState.defense;
        const damageToDeal = playerDefense * 2;

        const oldHp = target.value.hpCurrent;
        const oldDefense = target.value.defense;
        console.log('defense after the player hit me', playerDefense);
        if(playerDefense > 0){
            await this.effectService.apply({
                ctx: ctx,
                source: source,
                target,
                effect: {
                    effect: damageEffect.name,
                    args: {
                        value: damageToDeal
                    },
                },
            });
        }
        const    newHp = target.value.hpCurrent;
        const    newDefense = target.value.defense;

        await this.combatQueueService.push({
            ctx,
            source: dto.source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Damage,
                healthDelta: newHp - oldHp,
                defenseDelta: newDefense - oldDefense,
                finalHealth: newHp,
                finalDefense: newDefense,
                statuses: [],
            },
            action: {
                name: 'attack',
                hint: 'attack'
            },
        });
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
            comebackStatus,
        );
    }

}
