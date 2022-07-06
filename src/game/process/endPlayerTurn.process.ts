import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DiscardAllCardsAction } from '../action/discardAllCards.action';
import { UpdatePlayerEnergyAction } from '../action/updatePlayerEnergy.action';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';
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
        private readonly expeditionService: ExpeditionService,
        private readonly updatePlayerEnergyAction: UpdatePlayerEnergyAction,
        private readonly settingsService: SettingsService,
        private readonly beginEnemyTurnProcess: BeginEnemyTurnProcess,
    ) {}

    async handle(payload: EndPlayerTurnDTO): Promise<void> {
        const { client } = payload;

        await this.discardAllCardsAction.handle({ client });

        const {
            player: {
                energy: { initial },
            },
        } = await this.settingsService.getSettings();

        await this.updatePlayerEnergyAction.handle({
            clientId: client.id,
            newEnergy: initial,
        });

        const {
            data: {
                player: { energy, energyMax },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnergy}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndTurn,
                    action: SWARAction.UpdateEnergy,
                    data: [energy, energyMax],
                }),
            ),
        );

        await this.beginEnemyTurnProcess.handle({ client });
    }
}
