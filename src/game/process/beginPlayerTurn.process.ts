import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ChangeTurnAction } from '../action/changeTurn.action';
import { DrawCardAction } from '../action/drawCard.action';
import { GetPlayerInfoAction } from '../action/getPlayerInfo.action';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { SettingsService } from '../components/settings/settings.service';
import {
    EVENT_AFTER_PLAYER_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from '../constants';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

@Injectable()
export class BeginPlayerTurnProcess {
    constructor(
        @InjectPinoLogger()
        private readonly logger: PinoLogger,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly settingsService: SettingsService,
        private readonly drawCardAction: DrawCardAction,
        private readonly eventEmitter: EventEmitter2,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
        private readonly combatQueueService: CombatQueueService,
        private readonly changeTurnAction: ChangeTurnAction,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle({ ctx }: { ctx: GameContext }): Promise<void> {
        const { client } = ctx;

        // First set up the logger
        const logger = this.logger.logger.child(ctx.info);

        logger.info(`Beginning player turn`);

        await this.enemyService.calculateNewIntentions(ctx);

        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            {
                'currentNode.data.playing': CombatTurnEnum.Player,
                $inc: {
                    'currentNode.data.round': 1,
                },
            },
        );

        // Send change turn message
        this.changeTurnAction.handle({
            client,
            type: SWARMessageType.BeginTurn,
            entity: CombatTurnEnum.Player,
        });

        const { handSize, defense } = ctx.expedition.currentNode.data.player;

        // Start the combat queue
        await this.combatQueueService.start(ctx);

        await this.eventEmitter.emitAsync(EVENT_BEFORE_PLAYER_TURN_START, {
            ctx,
        });

        // Reset energy
        const { initialEnergy, maxEnergy } =
            await this.settingsService.getSettings();

        // Reset defense for the player
        if (defense > 0) await this.playerService.setDefense(ctx, 0);

        // Set player energy to default values
        await this.playerService.setEnergy(ctx, initialEnergy);

        // Send new energy amount
        logger.info(
            `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnergy}`,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.UpdateEnergy,
                data: [initialEnergy, maxEnergy],
            }),
        );

        await this.drawCardAction.handle({
            ctx,
            amountToTake: handSize,
            filterType: undefined,
            SWARMessageTypeToSend: SWARMessageType.BeginTurn,
        });

        // Send possible actions related to the statuses attached to the player at the beginning of the turn
        await this.eventEmitter.emitAsync(EVENT_AFTER_PLAYER_TURN_START, {
            ctx,
        });

        // Complete combat queue
        await this.combatQueueService.end(ctx);

        // Send updated player information
        const playerInfo = await this.getPlayerInfoAction.handle(client.id);

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.UpdatePlayer,
                data: playerInfo,
            }),
        );
    }
}
