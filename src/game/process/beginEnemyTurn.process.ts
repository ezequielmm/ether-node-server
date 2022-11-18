import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isEmpty } from 'lodash';
import { Socket } from 'socket.io';
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

interface BeginEnemyTurnDTO {
    client: Socket;
}

@Injectable()
export class BeginEnemyTurnProcess {
    private readonly logger: Logger = new Logger(BeginEnemyTurnProcess.name);

    private client: Socket;

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly effectService: EffectService,
        private readonly eventEmitter: EventEmitter2,
        private readonly combatQueueService: CombatQueueService,
        private readonly changeTurnAction: ChangeTurnAction,
    ) {}

    async handle(payload: BeginEnemyTurnDTO): Promise<void> {
        const { client } = payload;

        this.logger.debug(`Beginning enemies turn`);

        this.client = client;

        // Set combat turn change
        this.changeTurnAction.handle({
            client: this.client,
            type: SWARMessageType.BeginTurn,
            entity: CombatTurnEnum.Enemy,
        });

        const expedition = await this.expeditionService.setCombatTurn({
            clientId: this.client.id,
            playing: CombatTurnEnum.Enemy,
        });

        const {
            currentNode: {
                data: { enemies: allEnemies },
            },
        } = expedition;

        const enemies = allEnemies.filter(({ hpCurrent }) => {
            return hpCurrent > 0;
        });

        const ctx: GameContext = {
            client: this.client,
            expedition,
        };

        await this.combatQueueService.start(ctx);

        await this.eventEmitter.emitAsync(EVENT_BEFORE_ENEMIES_TURN_START, {
            ctx,
        });

        // Then we loop over them and get their intentions and effects
        for (const enemy of enemies) {
            const {
                currentScript: { intentions },
            } = enemy;

            const source: ExpeditionEnemy = {
                type: CardTargetedEnum.Enemy,
                value: enemy,
            };

            await this.eventEmitter.emitAsync(EVENT_BEFORE_ENEMY_INTENTIONS, {
                ctx,
                enemy,
            });

            for (const intention of intentions) {
                const { effects } = intention;

                if (!isEmpty(effects)) {
                    await this.effectService.applyAll({
                        ctx,
                        source,
                        effects,
                        selectedEnemy: enemy.id,
                    });

                    if (this.expeditionService.isCurrentCombatEnded(ctx)) {
                        this.logger.debug(
                            'Combat ended, skipping rest of enemies, intentions and effects',
                        );
                        return;
                    }
                }
            }
        }

        await this.sendUpdatedEnemiesData();
        await this.eventEmitter.emitAsync(EVENT_AFTER_ENEMIES_TURN_START, {
            ctx,
        });

        await this.combatQueueService.end(ctx);
    }

    private async sendUpdatedEnemiesData(): Promise<void> {
        // Next we query back the enemies from the database and
        // send them to the client
        const {
            data: { enemies: enemiesUpdated },
        } = await this.expeditionService.getCurrentNode({
            clientId: this.client.id,
        });

        // Send enemies updated
        this.logger.debug(
            `Sent message PutData to client ${this.client.id}: ${SWARAction.UpdateEnemy}`,
        );

        this.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.EnemyAffected,
                action: SWARAction.UpdateEnemy,
                data: enemiesUpdated
                    .filter(({ hpCurrent }) => {
                        return hpCurrent > 0;
                    })
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
