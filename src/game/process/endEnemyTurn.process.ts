import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { Context } from '../components/interfaces';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { StatusEventType } from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { BeginPlayerTurnProcess } from './beginPlayerTurn.process';

interface EndEnemyTurnDTO {
    ctx: Context;
}

@Injectable()
export class EndEnemyTurnProcess {
    private readonly logger: Logger = new Logger(EndEnemyTurnProcess.name);

    constructor(
        private readonly beingPlayerTurnProcess: BeginPlayerTurnProcess,
        private readonly statusService: StatusService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async handle(payload: EndEnemyTurnDTO): Promise<void> {
        const { ctx } = payload;
        const { client } = ctx;

        await this.eventEmitter.emitAsync('enemy:before-end-turn', { ctx });

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

        await this.statusService.trigger(ctx, StatusEventType.OnTurnEnd);
        await this.beingPlayerTurnProcess.handle({ client });
        await this.eventEmitter.emitAsync('enemy:after-end-turn', { ctx });
    }
}
