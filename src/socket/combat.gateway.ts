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
import { TakeCardFromPileEnum } from 'src/game/effects/chooseCard/chooseCard.effect';
import { MoveCardAction } from 'src/game/action/moveCard.action';

interface ICardPlayed {
    cardId: CardId;
    targetId?: TargetId;
}

interface IMoveCard {
    cardIds: string[];
    takeFromPile: TakeCardFromPileEnum;
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
        private readonly moveCardAction: MoveCardAction,
    ) {}

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<void> {
        this.logger.debug(`Client ${client.id} trigger message "EndTurn"`);

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
        this.logger.debug(
            `Client ${client.id} trigger message "CardPlayed": ${payload}`,
        );

        const { cardId, targetId }: ICardPlayed = JSON.parse(payload);

        await this.cardPlayedAction.handle({
            client,
            cardId,
            selectedEnemyId: targetId,
        });
    }

    @SubscribeMessage('MoveCard')
    async handleMoveCard(client: Socket, payload: string): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "MoveCard": ${payload}`,
        );

        const { cardIds, takeFromPile }: IMoveCard = JSON.parse(payload);
    }
}
