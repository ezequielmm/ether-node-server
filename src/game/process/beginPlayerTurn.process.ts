import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { DrawCardProcess } from './drawCard.process';

interface BeginPlayerTurnDTO {
    client: Socket;
}

@Injectable()
export class BeginPlayerTurnProcess {
    private readonly logger: Logger = new Logger(BeginPlayerTurnProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly settingsService: SettingsService,
        private readonly drawCardProcess: DrawCardProcess,
    ) {}

    async handle(payload: BeginPlayerTurnDTO): Promise<void> {
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
                    data: CombatTurnEnum.Player,
                }),
            ),
        );

        // Get previous round
        const {
            data: {
                round,
                player: { handSize },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // Update round and entity playing
        await this.expeditionService.setCombatTurn({
            clientId: client.id,
            playing: CombatTurnEnum.Player,
            newRound: round + 1,
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
                    data: CombatTurnEnum.Player,
                }),
            ),
        );

        // Reset energy
        const {
            player: {
                energy: { initial },
            },
        } = await this.settingsService.getSettings();

        await this.expeditionService.updatePlayerEnergy({
            clientId: client.id,
            newEnergy: initial,
        });

        await this.drawCardProcess.handle({ client, cardsTotake: handSize });
    }
}
