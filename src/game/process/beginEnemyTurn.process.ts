import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { filter, isEmpty } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import pino from 'pino';
import { ChangeTurnAction } from '../action/changeTurn.action';
import { CardTargetedEnum } from '../components/card/card.enum';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { ExpeditionEnemy } from '../components/enemy/enemy.interface';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import {
    EVENT_AFTER_ENEMIES_TURN_START,
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_ENEMY_INTENTIONS,
} from '../constants';
import { EffectService } from '../effects/effects.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { CombatService } from '../combat/combat.service';

@Injectable()
export class BeginEnemyTurnProcess {
    constructor(
        @InjectPinoLogger()
        private readonly logger: PinoLogger,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => EffectService))
        private readonly effectService: EffectService,
        private readonly eventEmitter: EventEmitter2,
        private readonly combatQueueService: CombatQueueService,
        private readonly changeTurnAction: ChangeTurnAction,
        @Inject(forwardRef(() => CombatService))
        private readonly combatService: CombatService,
    ) {}

    async handle({ ctx }: { ctx: GameContext }): Promise<void> {
        // First we set the loggers context
        const logger = this.logger.logger.child(ctx.info);
        logger.info(`Beginning enemies turn`);

        const { client, expedition } = ctx;

        await this.expeditionService.updateByFilter({ clientId: client.id }, { 'currentNode.data.playing': CombatTurnEnum.Enemy });

        // Set combat turn change
        this.changeTurnAction.handle({ client, type: SWARMessageType.BeginTurn, entity: CombatTurnEnum.Enemy });

        const allEnemies = expedition.currentNode?.data?.enemies;
        const enemiesAlive = filter(allEnemies, ({ hpCurrent }) => hpCurrent > 0);

        await this.combatQueueService.start(ctx);
        await this.eventEmitter.emitAsync(EVENT_BEFORE_ENEMIES_TURN_START, { ctx });

        // Then we loop over them and get their intentions and effects:
        for (const enemy of enemiesAlive) {
            
            const intentions = enemy.currentScript?.intentions;
            const source: ExpeditionEnemy = { type: CardTargetedEnum.Enemy, value: enemy };

            await this.eventEmitter.emitAsync(EVENT_BEFORE_ENEMY_INTENTIONS, { ctx, enemy });

            for (const intention of intentions) {
                const { effects } = intention;

                if (!isEmpty(effects)) {
                    await this.effectService.applyAll({
                        ctx,
                        source,
                        effects,
                        selectedEnemy: enemy.id,
                    });

                    if (this.combatService.isCurrentCombatEnded(ctx)) {
                        logger.info('Combat ended, skipping rest of enemies, intentions and effects');
                        return;
                    }
                }
            }
        }

        await this.sendUpdatedEnemiesData(ctx, logger);
        await this.eventEmitter.emitAsync(EVENT_AFTER_ENEMIES_TURN_START, { ctx });
        await this.combatQueueService.end(ctx);
    }

    private async sendUpdatedEnemiesData(
        ctx: GameContext,
        logger: pino.Logger<pino.LoggerOptions & pino.ChildLoggerOptions>,
    ): Promise<void> {
        const {
            client,
            expedition: {
                currentNode: {
                    data: { enemies },
                },
            },
        } = ctx;

        // Send enemies updated
        logger.info(
            `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnemy}`,
        );

        console.log("-------------------------------------------------------------------------------------------------------------------------")
        console.log("SendUdatedEnemiesData.. CurrentNode.enemies:")
        console.log(enemies)
        console.log("-------------------------------------------------------------------------------------------------------------------------")


        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EnemyAffected,
                action: SWARAction.UpdateEnemy,
                data: enemies
                    .filter(({ hpCurrent }) => hpCurrent > 0)
                    .map((enemy) => ({
                        id: enemy.id,
                        enemyId: enemy.enemyId,
                        defense: enemy.defense,
                        name: enemy.name,
                        type: enemy.type,
                        category: enemy.category,
                        size: enemy.size,
                        hpCurrent: enemy.hpCurrent,
                        hpMax: enemy.hpMax,
                    })),
            }),
        );
    }
}
