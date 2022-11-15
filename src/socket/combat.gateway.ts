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
import { CardSelectionScreenService } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.service';
import { MoveCardAction } from 'src/game/action/moveCard.action';
import { corsSocketSettings } from './socket.enum';

interface ICardPlayed {
    cardId: CardId;
    targetId?: TargetId;
}

interface IMoveCard {
    cardsToTake: string[];
}

@WebSocketGateway(corsSocketSettings)
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);

    constructor(
        private readonly cardPlayedAction: CardPlayedAction,
        private readonly endPlayerTurnProcess: EndPlayerTurnProcess,
        private readonly endEnemyTurnProcess: EndEnemyTurnProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly cardSelectionService: CardSelectionScreenService,
        private readonly moveCardAction: MoveCardAction,
    ) {}

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<void> {
        this.logger.debug(`Client ${client.id} trigger message "EndTurn"`);

        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        if (expedition.currentNode !== null) {
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

        // query the information received by the frontend
        const { cardsToTake }: IMoveCard = JSON.parse(payload);

        // Get card selection item
        const {
            cardIds: cardsAvailable,
            originPile,
            amount,
        } = await this.cardSelectionService.findOne({
            client_id: client.id,
        });

        // Here we validate that the frontend is sending us
        // the correct amount of cards to take, if not, we
        // only take the amount required, starting from the
        // first element
        const newCardList = cardsToTake
            .filter((cardId) => cardsAvailable.includes(cardId))
            .slice(0, amount);

        // With the right card to take, we call the move card action
        // with the right ids and the pile to take the cards
        await this.moveCardAction.handle({
            client,
            cardIds: newCardList,
            originPile,
            callback: (card) => {
                card.energy = 0;
                return card;
            },
        });

        // Now we remove the info from the database
        await this.cardSelectionService.deleteByClientId(client.id);
    }
}
