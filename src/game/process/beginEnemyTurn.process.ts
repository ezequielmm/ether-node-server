import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { EnemyDTO } from '../effects/effects.interface';
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

        const expedition = await this.expeditionService.setCombatTurn({
            clientId: client.id,
            playing: CombatTurnEnum.Enemy,
        });

        const {
            currentNode: {
                data: { enemies, round },
            },
        } = expedition;

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

            const source: EnemyDTO = {
                type: CardTargetedEnum.Enemy,
                value: enemy,
            };

            intentions.forEach(async (intention) => {
                const { effects } = intention;

                await this.effectService.applyAll({
                    client,
                    expedition,
                    source,
                    effects,
                    selectedEnemy: round,
                });
            });
        });
    }
}
