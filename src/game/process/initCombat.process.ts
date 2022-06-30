import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { isEven } from 'src/utils';
import { SetCombatTurnAction } from '../action/setCombatTurn.action';
import { UpdatePlayerEnergyAction } from '../action/updatePlayerEnergy.action';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { SendEnemyIntentProcess } from './sendEnemyIntents.process';

@Injectable()
export class InitCombatProcess {
    private readonly logger: Logger = new Logger(InitCombatProcess.name);

    constructor(
        private readonly setCombatTurnAction: SetCombatTurnAction,
        private readonly sendEnemyIntentProcess: SendEnemyIntentProcess,
        private readonly updatePlayerEnergyAction: UpdatePlayerEnergyAction,
        private readonly settingsService: SettingsService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async process(client: Socket): Promise<void> {
        const {
            currentNode: {
                data: {
                    round,
                    player: {
                        cards: { discard, hand },
                    },
                },
            },
        } = await this.setCombatTurnAction.handle({
            clientId: client.id,
            newRound: 1,
        });

        const newHandPile = [...discard, ...hand];

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: newHandPile,
            discard: [],
        });

        const {
            player: {
                energy: { initial: newEnergy },
            },
        } = await this.settingsService.getSettings();

        await this.updatePlayerEnergyAction.handle({
            clientId: client.id,
            newEnergy,
        });

        if (!isEven(round)) this.sendEnemyIntentProcess.process(client);

        this.logger.log(`Sent message "InitCombat" to client ${client.id}`);

        client.emit(
            'InitCombat',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.BeginCombat,
                    data: null,
                }),
            ),
        );
    }
}
