import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { Context } from '../components/interfaces';
import {
    EVENT_AFTER_ENEMY_TURN_END,
    EVENT_BEFORE_ENEMY_TURN_END,
} from '../constants';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
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
    ) {}

    async handle(payload: EndEnemyTurnDTO): Promise<void> {
        this.logger.debug(`Ending enemies turn`);

        const { ctx } = payload;
        const { client } = ctx;

        await this.eventEmitter.emitAsync(EVENT_BEFORE_ENEMY_TURN_END, { ctx });

        this.logger.debug(
            `Sent message PutData to client ${client.id}: ${SWARAction.ChangeTurn}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndTurn,
                    action: SWARAction.ChangeTurn,
                    data: CombatTurnEnum.Enemy,
                }),
            ),
        );

        await this.eventEmitter.emitAsync(EVENT_AFTER_ENEMY_TURN_END, { ctx });
        await this.beingPlayerTurnProcess.handle({ client });
    }
}
