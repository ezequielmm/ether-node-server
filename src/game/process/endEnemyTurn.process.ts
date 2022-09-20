import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChangeTurnAction } from '../action/changeTurn.action';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { Context } from '../components/interfaces';
import {
    EVENT_AFTER_ENEMIES_TURN_END,
    EVENT_BEFORE_ENEMIES_TURN_END,
} from '../constants';
import { SWARMessageType } from '../standardResponse/standardResponse';
import { BeginPlayerTurnProcess } from './beginPlayerTurn.process';

interface EndEnemyTurnDTO {
    ctx: Context;
}

@Injectable()
export class EndEnemyTurnProcess {
    private readonly logger: Logger = new Logger(EndEnemyTurnProcess.name);

    constructor(
        private readonly beingPlayerTurnProcess: BeginPlayerTurnProcess,
        private readonly eventEmitter: EventEmitter2,
        private readonly combatQueueService: CombatQueueService,
        private readonly changeTurnAction: ChangeTurnAction,
    ) {}

    async handle(payload: EndEnemyTurnDTO): Promise<void> {
        this.logger.debug(`Ending enemies turn`);

        const { ctx } = payload;
        const { client } = ctx;

        await this.combatQueueService.start(ctx);

        await this.eventEmitter.emitAsync(EVENT_BEFORE_ENEMIES_TURN_END, {
            ctx,
        });

        this.changeTurnAction.handle({
            client,
            type: SWARMessageType.EndTurn,
            entity: CombatTurnEnum.Enemy,
        });

        await this.eventEmitter.emitAsync(EVENT_AFTER_ENEMIES_TURN_END, {
            ctx,
        });

        await this.combatQueueService.end(ctx);

        await this.beingPlayerTurnProcess.handle({ client });
    }
}
