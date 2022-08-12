import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CardId } from 'src/game/components/card/card.type';
import { TargetId } from 'src/game/effects/effects.types';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';
import { EndPlayerTurnProcess } from 'src/game/process/endPlayerTurn.process';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CombatTurnEnum } from 'src/game/components/expedition/expedition.enum';
import { EndEnemyTurnProcess } from 'src/game/process/endEnemyTurn.process';

interface CardPlayedInterface {
    cardId: CardId;
    targetId?: TargetId;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);

    constructor(
        private readonly cardPlayedAction: CardPlayedAction,
        private readonly endPlayerTurnProcess: EndPlayerTurnProcess,
        private readonly endEnemyTurnProcess: EndEnemyTurnProcess,
        private readonly expeditionService: ExpeditionService,
    ) {}

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<void> {
        this.logger.log(`Client ${client.id} trigger message "EndTurn"`);

        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const {
            currentNode: {
                data: { playing },
            },
        } = expedition;

        switch (playing) {
            case CombatTurnEnum.Player:
                await this.endPlayerTurnProcess.handle({ client });
                break;
            case CombatTurnEnum.Enemy:
                await this.endEnemyTurnProcess.handle({
                    ctx: {
                        client,
                        expedition,
                    },
                });
                break;
        }
    }

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<void> {
        this.logger.log(
            `Client ${client.id} trigger message "CardPlayed": ${payload}`,
        );

        const { cardId, targetId }: CardPlayedInterface = JSON.parse(payload);

        await this.cardPlayedAction.handle({ client, cardId, targetId });
    }
}
