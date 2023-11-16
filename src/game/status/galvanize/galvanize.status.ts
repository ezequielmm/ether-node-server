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

@StatusDecorator({
    status: galvanize,
})
@Injectable()
export class GalvanizeStatus implements StatusEventHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService
    ){}

    async handle(dto: StatusEventDTO): Promise<void> {

        const { ctx, source, target } = dto;
        
        if(dto.eventArgs.card.cardType == 'attack' && dto.source.type == 'player'){

            const originalDefense = dto.source.value.combatState.defense; 
            const defenseCalculated = originalDefense + dto.status.args.value;
            console.log('value',dto.status.args.value);
            console.log('defensa calc', defenseCalculated);

            const finalDefense =  await this.playerService.setDefense(ctx, defenseCalculated);
            console.log('final defense', finalDefense);
            dto.ctx.expedition.currentNode.data.player.defense = finalDefense;

            await this.combatQueueService.push({
                ctx,
                source: this.playerService.get(ctx),
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Defense,
                    defenseDelta: dto.status.args.value,
                    finalDefense: defenseCalculated,
                    healthDelta: 0,
                    finalHealth: 0,
                    statuses: [],
                },
                action:{
                    name: 'defense',
                    hint: 'defense'
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
