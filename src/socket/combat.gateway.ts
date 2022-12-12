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
import { CustomException, ErrorBehavior } from './custom.exception';
import { GameContext } from 'src/game/components/interfaces';

interface ICardPlayed {
    cardId: CardId;
    targetId?: TargetId;
}

interface IMoveCard {
    cardToTake: string;
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

            const ctx: GameContext = {
                client,
                expedition,
            };

            switch (playing) {
                case CombatTurnEnum.Player:
                    await this.endPlayerTurnProcess.handle({ ctx });
                    break;
                case CombatTurnEnum.Enemy:
                    await this.endEnemyTurnProcess.handle({ ctx });
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

        const clientId = client.id;

        // query the information received by the frontend
        const { cardToTake } = JSON.parse(payload) as IMoveCard;

        // Get card selection item
        const cardSelection = await this.cardSelectionService.findOne({
            clientId,
        });

        if (!cardSelection)
            throw new CustomException(
                'Card selected is not available',
                ErrorBehavior.ReturnToMainMenu,
            );

        // Check if the id provided exists in the list
        if (cardSelection.cardIds.includes(cardToTake)) {
            // With the right card to take, we call the move card action
            // with the right ids and the pile to take the cards
            await this.moveCardAction.handle({
                client,
                cardIds: [cardToTake],
                originPile: cardSelection.originPile,
                targetPile: 'hand',
                callback: (card) => {
                    card.energy = 0;
                    return card;
                },
            });

            const amountToTake = cardSelection.amountToTake--;

            if (amountToTake > 0) {
                // Now we remove the id taken from the list and update
                // the custom deck
                await this.cardSelectionService.update({
                    clientId,
                    cardIds: cardSelection.cardIds.filter((card) => {
                        return card !== cardToTake;
                    }),
                    amountToTake,
                });
            } else {
                await this.cardSelectionService.deleteByClientId(clientId);
            }
        }
    }
}
