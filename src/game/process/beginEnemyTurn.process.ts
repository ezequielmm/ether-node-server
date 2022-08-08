import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isEmpty } from 'lodash';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { ExpeditionEnemy } from '../components/enemy/enemy.interface';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context } from '../components/interfaces';
import { EffectService } from '../effects/effects.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { StatusEventType } from '../status/interfaces';
import { StatusService } from '../status/status.service';

interface BeginEnemyTurnDTO {
    client: Socket;
}

@Injectable()
export class BeginEnemyTurnProcess {
    private readonly logger: Logger = new Logger(BeginEnemyTurnProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly effectService: EffectService,
        private readonly statusService: StatusService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async handle(payload: BeginEnemyTurnDTO): Promise<void> {
        const { client } = payload;

        const expedition = await this.expeditionService.setCombatTurn({
            clientId: client.id,
            playing: CombatTurnEnum.Enemy,
        });

        const {
            currentNode: {
                data: { enemies },
            },
        } = expedition;

        const ctx: Context = {
            client,
            expedition,
        };

        await this.eventEmitter.emitAsync('OnBeginEnemyTurn', { ctx });
        await this.statusService.trigger(ctx, StatusEventType.OnEnemyTurnStart);

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

        // Then we loop over them and get their intentions and effects
        enemies.forEach((enemy) => {
            const {
                currentScript: { intentions },
            } = enemy;

            const source: ExpeditionEnemy = {
                type: CardTargetedEnum.Enemy,
                value: enemy,
            };

            intentions.forEach(async (intention) => {
                const { effects } = intention;

                if (!isEmpty(effects)) {
                    await this.effectService.applyAll({
                        ctx,
                        source,
                        effects,
                        selectedEnemy: enemy.id,
                    });
                }
            });
        });
    }
}
