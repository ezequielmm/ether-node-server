import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { DiscardAllCardsAction } from '../action/discardAllCards.action';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context } from '../components/interfaces';
import {
    EVENT_AFTER_PLAYER_TURN_END,
    EVENT_BEFORE_PLAYER_TURN_END,
} from '../constants';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
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
    ) {}

    async handle(payload: EndPlayerTurnDTO): Promise<void> {
        const { client } = payload;

        this.logger.debug(`Ending player ${client.id} turn`);

        this.logger.debug(
            `Sent message PutData to client ${client.id}: ${SWARAction.ChangeTurn}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndTurn,
                    action: SWARAction.ChangeTurn,
                    data: CombatTurnEnum.Player,
                }),
            ),
        );

        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const ctx: Context = {
            client,
            expedition,
        };

        await this.eventEmitter.emitAsync(EVENT_BEFORE_PLAYER_TURN_END, {
            ctx,
        });

        await this.discardAllCardsAction.handle({
            client,
            SWARMessageTypeToSend: SWARMessageType.EndTurn,
        });

        await this.eventEmitter.emitAsync(EVENT_AFTER_PLAYER_TURN_END, { ctx });
        await this.beginEnemyTurnProcess.handle({ client });
    }
}
