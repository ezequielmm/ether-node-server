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
import { getRandomItemByWeight } from 'src/utils';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
import { CardKeywordPipeline } from 'src/game/cardKeywordPipeline/cardKeywordPipeline';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';

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
        private readonly enemyService: EnemyService,

    ){}

    async handle(dto: StatusEventDTO): Promise<void> {

        const { status: { args },
            eventArgs: {
                ctx,
                newHand
            },
        } = dto;
        const energy = ctx.expedition.currentNode.data.player.energy;
        console.log('CONTEXT -----------------------------------');
        console.log(ctx.exception.currentNode.data.player.cards.newHand);
        const probNum = (newHand.length / 100);
        console.log(probNum);
        let probability : number[] = [];
    
        newHand.forEach(card =>{
            probability.push(probNum);
        });

        console.log('PROBABILITY ----------------------', probability);
        
        while(energy > 0){

            const card = getRandomItemByWeight<IExpeditionPlayerStateDeckCard>(newHand, probability);
            const { keywords } = card;
            const { unplayable } = CardKeywordPipeline.process(keywords);

            if(!unplayable){
                const hasEnemyTarget = card.properties.effects.filter(e => e.target == CardTargetedEnum.Enemy).length > 0;
                let enemyId = undefined;

                if(hasEnemyTarget){
                    enemyId = this.enemyService.getRandom(ctx).value.id;
                }

                await this.cardPlayedAction.handle({
                    ctx,
                    cardId: card.id,
                    selectedEnemyId: enemyId,
                    newHand
                });
            }
        }
    }

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
