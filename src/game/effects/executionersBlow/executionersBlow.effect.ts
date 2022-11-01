import { Injectable, Logger } from '@nestjs/common';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { executionersBlowEffect } from './contants';
import { EffectDecorator } from '../effects.decorator';
import { EnemyService } from '../../components/enemy/enemy.service';
import { HistoryService } from 'src/game/history/history.service';
import { MoveCardAction } from 'src/game/action/moveCard.action';
import { CardSelectionScreenOriginPileEnum } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.enum';
import { CardRegistry } from 'src/game/history/interfaces';
import {
    ExecutionersBlowCard,
    ExecutionersBlowCardUpgraded,
} from 'src/game/components/card/data/executionersBlow.card';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';

export interface ExecutionersBlowArgs {
    upgraded: boolean;
}

@EffectDecorator({
    effect: executionersBlowEffect,
})
@Injectable()
export class ExecutionersBlowEffect implements EffectHandler {
    private readonly logger = new Logger(ExecutionersBlowEffect.name);

    constructor(
        private readonly enemyService: EnemyService,
        private readonly historyService: HistoryService,
        private readonly moveCardAction: MoveCardAction,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(payload: EffectDTO<ExecutionersBlowArgs>): Promise<void> {
        const { ctx, target, args } = payload;

        if (EnemyService.isEnemy(target) && this.enemyService.isDead(target)) {
            // Log enemy death
            this.logger.log(
                `Enemy ${target.value.id} is dead, adding Executioner's Blow Card with 0 energy cost`,
            );

            // End the combat queue and send info with the damage
            // Start new combat queue for next effects
            await this.combatQueueService.end(ctx);
            await this.combatQueueService.start(ctx);

            const cardRegistry = this.historyService.findLast(ctx.client.id, {
                type: 'card',
                card: {
                    cardId: args.upgraded
                        ? ExecutionersBlowCardUpgraded.cardId
                        : ExecutionersBlowCard.cardId,
                },
            }) as CardRegistry;

            if (!cardRegistry) {
                throw new Error(
                    'Could not find card registry for ExecutionersBlow',
                );
            }

            await this.moveCardAction.handle({
                client: ctx.client,
                cardIds: [cardRegistry.card.id],
                originPile: CardSelectionScreenOriginPileEnum.Discard,
                cardIsFree: true,
            });
        }
    }
}
