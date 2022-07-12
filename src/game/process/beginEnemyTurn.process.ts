import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { EffectService } from '../effects/effects.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface BeginEnemyTurnDTO {
    client: Socket;
}

@Injectable()
export class BeginEnemyTurnProcess {
    private readonly logger: Logger = new Logger(BeginEnemyTurnProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly effectService: EffectService,
    ) {}

    async handle(payload: BeginEnemyTurnDTO): Promise<void> {
        const { client } = payload;

        await this.expeditionService.setCombatTurn({
            clientId: client.id,
            playing: CombatTurnEnum.Enemy,
        });

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.ChangeTurn}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.BeginTurn,
                    action: SWARAction.ChangeTurn,
                    data: CombatTurnEnum.Enemy,
                }),
            ),
        );

        // First we get all the enemies from the current node
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // Then we loop over them and get their intentions and effects
        enemies.forEach((enemy) => {
            const {
                currentScript: { intentions },
            } = enemy;

            intentions.forEach((intention) => {
                const { effect } = intention;
            });
        });
    }
}
