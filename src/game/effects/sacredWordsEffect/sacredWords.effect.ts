import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { removeCardsFromPile } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { sacredWordEffect } from './constants';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { forEach } from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_BEFORE_ENEMY_INTENTIONS } from 'src/game/constants';
import { ExpeditionEnemy } from 'src/game/components/enemy/enemy.interface';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { CombatService } from 'src/game/combat/combat.service';
import { EffectService } from '../effects.service';
import { logger } from '@typegoose/typegoose/lib/logSettings';
import { isEmpty } from 'class-validator/types/decorator/common/IsEmpty';
import { SWARMessageType } from 'src/game/standardResponse/standardResponse';
import { DrawCardAction } from 'src/game/action/drawCard.action';


@EffectDecorator({
    effect: sacredWordEffect,
})
@Injectable()
export class SacredWordEffect implements EffectHandler {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly historyService: HistoryService,
        private readonly enemyService: EnemyService,
        private readonly drawCardAction: DrawCardAction,

        // private readonly eventEmitter: EventEmitter2,
        // @Inject(forwardRef(() => CombatService))
        // private readonly combatService: CombatService,
        // @Inject(forwardRef(() => EffectService))
        // private readonly effectService: EffectService,

    ) { }

    async handle(payload: EffectDTO): Promise<void> {
        // Here we get the client Socket and the cards from the
        // current node object
        const {
            ctx: {
                expedition: {
                    currentNode: {
                        data: {
                            player: {
                                cards: { hand },
                            },
                        },
                    },
                },
            },
        } = payload;
        
        const ctx = payload.ctx;

        // This is just to send the correct message type across the effect
        const SWARMessageTypeToSend = SWARMessageType.PlayerAffected;

        // Here we get how many cards we currently have
        // in the hand pile
        const cardsToDrawBack = 2;

        

        // Now, we take the amount of cards we had on the hand pile
        // from the draw pile
        await this.drawCardAction.handle({
            ctx,
            amountToTake: cardsToDrawBack,
            filterType: undefined,
            SWARMessageTypeToSend,
        });
    }
}
