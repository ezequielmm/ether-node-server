import { Injectable } from '@nestjs/common';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { galvanize } from './constants';
import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import { OnEvent } from '@nestjs/event-emitter';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusService } from '../status.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CardTargetedEnum, CardTypeEnum } from 'src/game/components/card/card.enum';
import { defenseEffect } from 'src/game/effects/defense/constants';
@StatusDecorator({
    status: galvanize,
})
@Injectable()
export class GalvanizeStatus implements StatusEventHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService,
        private readonly effectService: EffectService
    ){}

    async handle(dto: StatusEventDTO): Promise<void> {

        const { ctx, source, eventArgs, status } = dto;
        
        if(eventArgs.card.cardType == CardTypeEnum.Attack && source.type == CardTargetedEnum.Player){

            const originalDefense = source.value.combatState.defense; 
            const defenseCalculated = originalDefense + dto.status.args.value;
            const player = this.playerService.get(ctx);
            const value = status.args.value;
            console.log('VALUE ------------------------> ', value);
            await this.effectService.apply({
                ctx,
                source,
                target: player,
                effect: {
                    effect: defenseEffect.name,
                    args: {
                        value,
                    },
                },
            });

            await this.combatQueueService.push({
                ctx,
                source: player,
                target: player,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Defense,
                    defenseDelta: dto.status.args.value,
                    finalDefense: defenseCalculated,
                    healthDelta: 0,
                    finalHealth: 0,
                    statuses: [],
                },
                action:{
                    name: 'defend',
                    hint: 'defend'
                },
            });
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
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
            galvanize,
        );
    }

}
