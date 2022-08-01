import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionDocument } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PlayerService } from '../components/player/player.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { StatusEventType } from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { BeginPlayerTurnProcess } from './beginPlayerTurn.process';

interface EndEnemyTurnDTO {
    client: Socket;
}

@Injectable()
export class EndEnemyTurnProcess {
    private readonly logger: Logger = new Logger(EndEnemyTurnProcess.name);

    constructor(
        private readonly beingPlayerTurnProcess: BeginPlayerTurnProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly statusService: StatusService,
        private readonly playerService: PlayerService,
    ) {}

    async handle(payload: EndEnemyTurnDTO): Promise<void> {
        const { client } = payload;

        this.logger.log(
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

        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        await this.statusService.trigger(
            client,
            expedition,
            StatusEventType.OnTurnEnd,
        );

        await this.playerService.setDefense(
            {
                client,
                expedition: expedition as ExpeditionDocument,
            },
            0,
        );

        await this.beingPlayerTurnProcess.handle({ client });
    }
}
