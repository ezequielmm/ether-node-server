import { Injectable } from '@nestjs/common';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { mistifiedStatus } from './constants';
import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import { OnEvent } from '@nestjs/event-emitter';
import { GameContext } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusService } from '../status.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CardService } from 'src/game/components/card/card.service';
import { CombatService } from 'src/game/combat/combat.service';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';

@StatusDecorator({
    status: mistifiedStatus,
})
@Injectable()
export class MistifiedStatus implements StatusEventHandler {
    constructor(
        private readonly cardService: CardService,
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService,
        private readonly cardPlayedAction: CardPlayedAction,
    ){}

    async handle(dto: StatusEventDTO): Promise<void> {

        const { ctx, source, target } = dto;
        const energy = ctx.expedition.currentNode.data.player.energy;
        const hand = ctx.expedition.currentNode.data.player.cards.hand;
        const newHand = this.cardService.shuffleArray(hand);

        for(const card of newHand){

            while(energy > 0){
                await this.cardPlayedAction.handle({
                    ctx,
                    cardId: card.id,
                    selectedEnemyId: undefined,
                    //forceExhaust,
                    newHand,
                });
            }
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
            mistifiedStatus,
        );
    }

}
