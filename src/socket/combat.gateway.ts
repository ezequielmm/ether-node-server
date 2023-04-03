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
import { SendEnemyIntentProcess } from 'src/game/process/sendEnemyIntents.process';
import { DataWSRequestTypesEnum } from './socket.enum';
import { SWARMessageType, StandardResponse } from 'src/game/standardResponse/standardResponse';
import { EnemyService } from 'src/game/components/enemy/enemy.service';

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
        private readonly sendEnemyIntentsProcess: SendEnemyIntentProcess,
        private readonly enemyService: EnemyService,
    ) {}

    private readonly logger: Logger = new Logger(CombatGateway.name);

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<END TURN>');
                try {
                    const ctx = await this.expeditionService.getGameContext(
                        client,
                    );
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
            },
        );
    }

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<void> {
        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<PLAY CARD>');
                try {
                    const ctx = await this.expeditionService.getGameContext(
                        client,
                    );
                    const { cardId, targetId }: ICardPlayed =
                        JSON.parse(payload);

                    // Check if combat is on player turn. If not, bail without trying to play a card, because they, uh, can't.
                    if (
                        ctx.expedition.currentNode.data.playing !==
                        CombatTurnEnum.Player
                    )
                        return;

                    const enemyComparisonStatuses = this.enemyService.getEnemyStatuses(ctx);

                    await this.cardPlayedAction.handle({
                        ctx,
                        cardId,
                        selectedEnemyId: targetId,
                    });

                    // reload ctx because cardPlayedAction somehow switches to "newCtx" halfway through, so reference likely breaks
                    // const afterctx = await this.expeditionService.getGameContext(client);

                    // currently we are comparing ALL statuses, not just enemy ones, but the intents process doesn't factor in player statuses
                    if (this.enemyService.haveChangedStatuses(ctx, enemyComparisonStatuses)) {
                        client.emit(
                            'PutData',
                            StandardResponse.respond({
                                message_type: SWARMessageType.GenericData,
                                action: DataWSRequestTypesEnum.EnemyIntents,
                                data: await this.sendEnemyIntentsProcess.handle(ctx),
                            })
                        );
                    }

                } catch (error) {
                    this.logger.error({
                        error,
                    });
                }
                this.logger.debug('</PLAY CARD>');
            },
        );
    }
}
