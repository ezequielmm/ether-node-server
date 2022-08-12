import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { DrawCardAction } from '../action/drawCard.action';
import { GetPlayerInfoAction } from '../action/getPlayerInfo.action';
import { EnemyService } from '../components/enemy/enemy.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionDocument } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { SettingsService } from '../components/settings/settings.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { StatusEventType } from '../status/interfaces';
import { StatusService } from '../status/status.service';

interface BeginPlayerTurnDTO {
    client: Socket;
}

@Injectable()
export class BeginPlayerTurnProcess {
    private readonly logger: Logger = new Logger(BeginPlayerTurnProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly settingsService: SettingsService,
        private readonly drawCardAction: DrawCardAction,
        private readonly statusService: StatusService,
        private readonly eventEmitter: EventEmitter2,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
    ) {}

    async handle(payload: BeginPlayerTurnDTO): Promise<void> {
        const { client } = payload;

        // Get previous round
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const {
            currentNode: {
                data: {
                    round,
                    player: { handSize, defense: currentDefense },
                },
            },
        } = expedition;

        const ctx: Context = {
            client,
            expedition: expedition as ExpeditionDocument,
        };

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
        const { initialEnergy, maxEnergy } =
            await this.settingsService.getSettings();

        // Reset defense
        if (currentDefense > 0) await this.playerService.setDefense(ctx, 0);

        this.playerService.setEnergy(ctx, initialEnergy);

        // Send new energy amount
        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnergy}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerAffected,
                    action: SWARAction.UpdateEnergy,
                    data: [initialEnergy, maxEnergy],
                }),
            ),
        );

        await this.drawCardAction.handle({
            client,
            amountToTake: handSize,
            cardType: undefined,
            SWARMessageTypeToSend: SWARMessageType.BeginTurn,
        });

        await this.enemyService.calculateNewIntentions(ctx);

        await this.eventEmitter.emitAsync('player:before-start-turn', { ctx });

        await this.statusService.trigger(
            ctx,
            StatusEventType.OnPlayerTurnStart,
        );

        // Send updated player information
        const playerInfo = await this.getPlayerInfoAction.handle(client.id);

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerAffected,
                    action: SWARAction.UpdatePlayer,
                    data: playerInfo,
                }),
            ),
        );

        await this.eventEmitter.emitAsync('player:after-start-turn', { ctx });
    }
}
