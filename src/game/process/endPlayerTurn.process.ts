import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { ChangeTurnAction } from '../action/changeTurn.action';
import { DiscardAllCardsAction } from '../action/discardAllCards.action';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context } from '../components/interfaces';
import {
    EVENT_AFTER_PLAYER_TURN_END,
    EVENT_BEFORE_PLAYER_TURN_END,
} from '../constants';
import { SWARMessageType } from '../standardResponse/standardResponse';
import { BeginEnemyTurnProcess } from './beginEnemyTurn.process';

interface EndPlayerTurnDTO {
    client: Socket;
}

@Injectable()
export class EndPlayerTurnProcess {
    private readonly logger: Logger = new Logger(EndPlayerTurnProcess.name);

    constructor(
        private readonly discardAllCardsAction: DiscardAllCardsAction,
        private readonly beginEnemyTurnProcess: BeginEnemyTurnProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly eventEmitter: EventEmitter2,
        private readonly combatQueueService: CombatQueueService,
        private readonly changeTurnAction: ChangeTurnAction,
    ) {}

    async handle(payload: EndPlayerTurnDTO): Promise<void> {
        const { client } = payload;

        this.logger.debug(`Ending player ${client.id} turn`);

        this.changeTurnAction.handle({
            client,
            type: SWARMessageType.EndTurn,
            entity: CombatTurnEnum.Player,
        });

        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const ctx: Context = {
            client,
            expedition,
        };

        await this.combatQueueService.start(ctx);

        await this.eventEmitter.emitAsync(EVENT_BEFORE_PLAYER_TURN_END, {
            ctx,
        });

        await this.discardAllCardsAction.handle({
            client,
            SWARMessageTypeToSend: SWARMessageType.EndTurn,
        });

        await this.eventEmitter.emitAsync(EVENT_AFTER_PLAYER_TURN_END, { ctx });

        await this.combatQueueService.end(ctx);

        await this.beginEnemyTurnProcess.handle({ client });
    }
}
