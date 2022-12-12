import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChangeTurnAction } from '../action/changeTurn.action';
import { DiscardAllCardsAction } from '../action/discardAllCards.action';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { GameContext } from '../components/interfaces';
import { EVENT_AFTER_PLAYER_TURN_END } from '../constants';
import { SWARMessageType } from '../standardResponse/standardResponse';
import { BeginEnemyTurnProcess } from './beginEnemyTurn.process';

interface EndPlayerTurnDTO {
    ctx: GameContext;
}

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
    ) {}

    async handle(payload: EndPlayerTurnDTO): Promise<void> {
        const { ctx } = payload;

        const { client, expedition } = ctx;

        this.logger.debug(`Ending player ${client.id} turn`);

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

        const enemies = allEnemies.filter(({ hpCurrent }) => hpCurrent > 0);

        for (const { id } of enemies) {
            await this.enemyService.setDefense(ctx, id, 0);
        }

        await this.combatQueueService.start(ctx);

        await this.discardAllCardsAction.handle({
            client,
            SWARMessageTypeToSend: SWARMessageType.EndTurn,
        });

        await this.eventEmitter.emitAsync(EVENT_AFTER_PLAYER_TURN_END, { ctx });

        await this.combatQueueService.end(ctx);

        await this.beginEnemyTurnProcess.handle({ client });
    }
}
