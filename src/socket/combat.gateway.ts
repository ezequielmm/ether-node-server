import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CardId } from 'src/game/components/card/card.type';
import { TargetId } from 'src/game/effects/effects.types';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';
import { EndPlayerTurnProcess } from 'src/game/process/endPlayerTurn.process';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CombatTurnEnum } from 'src/game/components/expedition/expedition.enum';
import { EndEnemyTurnProcess } from 'src/game/process/endEnemyTurn.process';
import { corsSocketSettings } from './socket.enum';
import { NodeType } from 'src/game/components/expedition/node-type';
import { Logger } from '@nestjs/common';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';

interface ICardPlayed {
    cardId: CardId;
    targetId?: TargetId;
}

@WebSocketGateway(corsSocketSettings)
export class CombatGateway {
    constructor(
        private readonly cardPlayedAction: CardPlayedAction,
        private readonly endPlayerTurnProcess: EndPlayerTurnProcess,
        private readonly endEnemyTurnProcess: EndEnemyTurnProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    private readonly logger: Logger = new Logger(CombatGateway.name);

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(
                client.id,
            ),
            async () => {
                this.logger.debug('<END TURN>');
                try {
                    const ctx = await this.expeditionService.getGameContext(client);
                    const { expedition } = ctx;

                        // If the combat is ended, we skip the turn
                        if (this.expeditionService.isCurrentCombatEnded(ctx))
                            return;

                        if (
                            expedition.currentNode === null ||
                            expedition.currentNode.nodeType !== NodeType.Combat
                        )
                            return;

                        const {
                            currentNode: {
                                data: { playing },
                            },
                        } = expedition;

                    switch (playing) {
                        case CombatTurnEnum.Player:
                            await this.endPlayerTurnProcess.handle({ ctx });
                            break;
                        case CombatTurnEnum.Enemy:
                            await this.endEnemyTurnProcess.handle({ ctx });
                            break;
                    }
                } catch (error) {
                    this.logger.error({
                        error,
                    });
                }
                this.logger.debug('</END TURN>');
            }
        );
    }

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<void> {

        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(
                client.id,
            ),
            async () => {
                this.logger.debug('<PLAY CARD>');
                try {
                    const ctx = await this.expeditionService.getGameContext(client);
                    const { cardId, targetId }: ICardPlayed = JSON.parse(payload);

                        // Check if combat is on player turn. If not, bail without trying to play a card, because they, uh, can't.
                        if (
                            ctx.expedition.currentNode.data.playing !==
                            CombatTurnEnum.Player
                        )
                            return;

                        await this.cardPlayedAction.handle({
                            ctx,
                            cardId,
                            selectedEnemyId: targetId,
                        });
                    } catch (error) {
                        this.logger.error({
                            error,
                        });
                    }
                this.logger.debug('</PLAY CARD>');
            }
        );
    }
}
