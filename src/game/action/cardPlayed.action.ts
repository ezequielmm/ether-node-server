import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { canPlayerPlayCard } from 'src/utils/canCardBePlayed';
import { CardKeywordPipeline } from '../cardKeywordPipeline/cardKeywordPipeline';
import {
    CardEnergyEnum,
    CardPlayErrorMessages,
} from '../components/card/card.enum';
import { CardId, getCardIdField } from '../components/card/card.type';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { EVENT_AFTER_CARD_PLAY, EVENT_BEFORE_CARD_PLAY } from '../constants';
import { EffectService } from '../effects/effects.service';
import { TargetId } from '../effects/effects.types';
import { HistoryService } from '../history/history.service';
import { EndPlayerTurnProcess } from '../process/endPlayerTurn.process';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { StatusService } from '../status/status.service';
import { DiscardCardAction } from './discardCard.action';
import { ExhaustCardAction } from './exhaustCard.action';

@Injectable()
export class CardPlayedAction {
    private readonly logger: Logger = new Logger(CardPlayedAction.name);

    constructor(
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly effectService: EffectService,
        private readonly statusService: StatusService,
        private readonly discardCardAction: DiscardCardAction,
        private readonly exhaustCardAction: ExhaustCardAction,
        private readonly endPlayerTurnProcess: EndPlayerTurnProcess,
        private readonly playerService: PlayerService,
        private readonly combatQueueService: CombatQueueService,
        private readonly historyService: HistoryService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async handle({
        cardId,
        selectedEnemyId,
        ctx,
    }: {
        readonly ctx: GameContext;
        readonly cardId: CardId;
        readonly selectedEnemyId: TargetId;
    }): Promise<void> {
        // First make sure card exists on player's hand pile
        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            clientId: ctx.client.id,
            cardId,
        });

        if (!cardExists) {
            this.sendInvalidCardMessage(ctx.client);
        } else {
            // If the card is valid we get the current node information
            // to validate the enemy
            const expedition = await this.expeditionService.findOne({
                clientId: ctx.client.id,
            });

            const {
                currentNode: {
                    data: {
                        player: {
                            energy: availableEnergy,
                            cards: { hand },
                        },
                    },
                },
            } = expedition;

            // If everything goes right, we get the card information from
            // the player hand pile
            const card = hand.find((card) => {
                const field = getCardIdField(cardId);

                return card[field] === cardId;
            });

            const {
                properties: { effects, statuses },
                keywords,
            } = card;

            const { exhaust, endTurn, unplayable } =
                CardKeywordPipeline.process(keywords);

            // Here we check if the card has a keyword for unplayable
            if (unplayable) {
                this.sendNotEnoughEnergyMessage(
                    ctx.client,
                    CardPlayErrorMessages.UnplayableCard,
                );
            } else {
                this.logger.debug(
                    `Started combat queue for client ${ctx.client.id}`,
                );

                await this.combatQueueService.start(ctx);

                // Next we make sure that the card can be played and the user has
                // enough energy
                const { canPlayCard, message } = canPlayerPlayCard(
                    card.energy,
                    availableEnergy,
                );

                // next we inform the player that is not possible to play the card
                if (!canPlayCard) {
                    this.sendNotEnoughEnergyMessage(ctx.client, message);
                } else {
                    this.logger.verbose(
                        `Player ${ctx.client.id} played card: ${card.name}`,
                    );

                    const source = this.playerService.get(ctx);
                    const sourceReference =
                        this.statusService.getReferenceFromEntity(source);

                    this.historyService.register({
                        clientId: ctx.client.id,
                        registry: {
                            type: 'card',
                            source,
                            card,
                            round: ctx.expedition.currentNode.data.round,
                        },
                    });

                    await this.eventEmitter.emitAsync(EVENT_BEFORE_CARD_PLAY, {
                        ctx,
                        card,
                        cardSource: source,
                        cardSourceReference: sourceReference,
                        cardTargetId: selectedEnemyId,
                    });

                    // if the card can be played, we update the energy, apply the effects
                    // and move the card to the desired pile
                    if (exhaust) {
                        await this.exhaustCardAction.handle({
                            client: ctx.client,
                            cardId,
                        });
                    } else {
                        await this.discardCardAction.handle({
                            client: ctx.client,
                            cardId,
                        });
                    }

                    const newCtx = await this.expeditionService.getGameContext(
                        ctx.client,
                    );

                    await this.effectService.applyAll({
                        ctx: newCtx,
                        source,
                        effects,
                        selectedEnemy: selectedEnemyId,
                    });

                    // After applying the effects, check if the current
                    // combat has ended and if so, skip all next steps
                    if (this.expeditionService.isCurrentCombatEnded(ctx)) {
                        this.logger.debug(
                            'Current node is completed. Skipping next actions',
                        );
                        return;
                    }

                    await this.statusService.attachAll({
                        ctx: newCtx,
                        statuses,
                        targetId: selectedEnemyId,
                        source,
                    });

                    const {
                        data: {
                            player: { energy, energyMax },
                        },
                    } = await this.expeditionService.getCurrentNode({
                        clientId: ctx.client.id,
                    });

                    const newEnergy =
                        card.energy === CardEnergyEnum.All
                            ? 0
                            : energy - card.energy;

                    await this.playerService.setEnergy(ctx, newEnergy);

                    this.sendUpdateEnergyMessage(
                        ctx.client,
                        newEnergy,
                        energyMax,
                    );

                    this.logger.debug(
                        `Ended combat queue for client ${ctx.client.id}`,
                    );
                    await this.combatQueueService.end(newCtx);

                    await this.eventEmitter.emitAsync(EVENT_AFTER_CARD_PLAY, {
                        ctx: newCtx,
                        card,
                        cardSource: source,
                        cardSourceReference: sourceReference,
                        cardTargetId: selectedEnemyId,
                    });

                    if (endTurn)
                        await this.endPlayerTurnProcess.handle({ ctx: newCtx });
                }
            }
        }
    }

    private sendInvalidCardMessage(client: Socket): void {
        this.logger.error(
            `Sent message ErrorMessage to client ${client.id}: ${SWARAction.InvalidCard}`,
        );

        client.emit(
            'ErrorMessage',
            StandardResponse.respond({
                message_type: SWARMessageType.Error,
                action: SWARAction.InvalidCard,
                data: null,
            }),
        );
    }

    private sendNotEnoughEnergyMessage(client: Socket, message: string): void {
        this.logger.debug(
            `Sent message ErrorMessage to client ${client.id}: ${SWARAction.InsufficientEnergy}`,
        );

        client.emit(
            'ErrorMessage',
            StandardResponse.respond({
                message_type: SWARMessageType.Error,
                action: SWARAction.InsufficientEnergy,
                data: message,
            }),
        );
    }

    private sendUpdateEnergyMessage(
        client: Socket,
        energy: number,
        energyMax: number,
    ): void {
        this.logger.debug(
            `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnergy}`,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.UpdateEnergy,
                data: [energy, energyMax],
            }),
        );
    }
}
