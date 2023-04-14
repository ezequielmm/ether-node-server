import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { filter } from 'lodash';
import { ChangeTurnAction } from '../action/changeTurn.action';
import { DiscardAllCardsAction } from '../action/discardAllCards.action';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { GameContext } from '../components/interfaces';
import {
    EVENT_AFTER_PLAYER_TURN_END,
    EVENT_BEFORE_PLAYER_TURN_END,
} from '../constants';
import { SWARMessageType } from '../standardResponse/standardResponse';
import { BeginEnemyTurnProcess } from './beginEnemyTurn.process';
import { CardService } from '../components/card/card.service';

@Injectable()
export class EndPlayerTurnProcess {
    private readonly logger: Logger = new Logger(EndPlayerTurnProcess.name);

    constructor(
        private readonly discardAllCardsAction: DiscardAllCardsAction,
        private readonly beginEnemyTurnProcess: BeginEnemyTurnProcess,
        private readonly eventEmitter: EventEmitter2,
        private readonly combatQueueService: CombatQueueService,
        private readonly changeTurnAction: ChangeTurnAction,
        private readonly enemyService: EnemyService,
        @Inject(forwardRef(() => CardService))
        private readonly cardService: CardService,
    ) {}

    async handle({ ctx }: { ctx: GameContext }): Promise<void> {
        // Set the logger context
        this.logger.log(ctx.info, `Ending player turn`);

        const { client, expedition } = ctx;

        await this.combatQueueService.start(ctx);

        // explicitly handle hand cards instead of using event emitter
        await this.cardService.onBeforePlayerTurnEnd({ ctx });

        await this.eventEmitter.emitAsync(EVENT_BEFORE_PLAYER_TURN_END, {
            ctx,
        });

        await this.combatQueueService.end(ctx);

        this.changeTurnAction.handle({
            client,
            type: SWARMessageType.EndTurn,
            entity: CombatTurnEnum.Player,
        });

        // Reset defense for the enemies that are alive
        const {
            currentNode: {
                data: { enemies: allEnemies },
            },
        } = expedition;

        const enemies = filter(allEnemies, ({ hpCurrent }) => hpCurrent > 0);

        for (const { id } of enemies) {
            await this.enemyService.setDefense(ctx, id, 0);
        }

        await this.combatQueueService.start(ctx);

        await this.discardAllCardsAction.handle(ctx, SWARMessageType.EndTurn);

        await this.eventEmitter.emitAsync(EVENT_AFTER_PLAYER_TURN_END, { ctx });

        await this.combatQueueService.end(ctx);

        await this.beginEnemyTurnProcess.handle({ ctx });
    }
}
