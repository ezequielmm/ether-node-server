import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import pino from 'pino';
import { Socket } from 'socket.io';
import { canPlayerPlayCard } from 'src/utils/canCardBePlayed';
import { CardKeywordPipeline } from '../cardKeywordPipeline/cardKeywordPipeline';
import { CombatService } from '../combat/combat.service';
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
import { CardService } from '../components/card/card.service';

@Injectable()
export class CardPlayedAction {
    constructor(
        @InjectPinoLogger(CardPlayedAction.name)
        private readonly logger: PinoLogger,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly combatQueueService: CombatQueueService,
        private readonly historyService: HistoryService,
        @Inject(forwardRef(() => CombatService))
        private readonly combatService: CombatService,
        @Inject(forwardRef(() => EffectService))
        private readonly effectService: EffectService,
        @Inject(forwardRef(() => CardService))
        private readonly cardService: CardService,
        private readonly statusService: StatusService,
        private readonly playerService: PlayerService,
        private readonly discardCardAction: DiscardCardAction,
        private readonly exhaustCardAction: ExhaustCardAction,
        private readonly endPlayerTurnProcess: EndPlayerTurnProcess,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async handle({
        cardId,
        selectedEnemyId,
        ctx,
        forceExhaust = false,
    }: {
        readonly ctx: GameContext;
        readonly cardId: CardId;
        readonly selectedEnemyId: TargetId;
        readonly forceExhaust?: boolean;
    }): Promise<void> {
        const logger = this.logger.logger.child(ctx.info);

        const {
            expedition: {
                currentNode: {
                    data: {
                        player: {
                            energy: availableEnergy,
                            cards: { hand },
                        },
                    },
                },
            },
        } = ctx;

        // If everything goes right, we get the card information from
        // the player hand pile
        const card = hand.find((card) => {
            const field = getCardIdField(cardId);

            return card[field] === cardId;
        });

        if (!card) {
            this.sendInvalidCardMessage(ctx.client, logger);
            return;
        }

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
                logger,
            );
            return;
        }

        logger.info(`Started combat queue for client ${ctx.client.id}`);

        await this.combatQueueService.start(ctx);

        // Next we make sure that the card can be played and the user has
        // enough energy
        const { canPlayCard, message } = canPlayerPlayCard(
            card.energy,
            availableEnergy,
        );

        // next we inform the player that is not possible to play the card
        if (!canPlayCard) {
            this.sendNotEnoughEnergyMessage(ctx.client, message, logger);
            return;
        }

        logger.info(`Player ${ctx.client.id} played card: ${card.name}`);

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

        // go ahead and send the appropriate movement message now, before applying things, so the screen looks cool.
        if (exhaust) {
            this.exhaustCardAction.emit({
                ctx,
                cardId,
            });
        } else {
            this.discardCardAction.emit({
                ctx,
                cardId,
            });
        }

        // const newCtx = await this.expeditionService.getGameContext(
        //     ctx.client,
        // );

        await this.effectService.applyAll({
            ctx,
            source,
            effects,
            selectedEnemy: selectedEnemyId,
        });

        // After applying the effects, check if the current
        // combat has ended and if so, skip all next steps
        if (this.combatService.isCurrentCombatEnded(ctx)) {
            logger.info('Current node is completed. Skipping next actions');
            return;
        }

        await this.statusService.attachAll({
            ctx,
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
            card.energy === CardEnergyEnum.All ? 0 : energy - card.energy;

        await this.playerService.setEnergy(ctx, newEnergy);

        this.sendUpdateEnergyMessage(ctx.client, newEnergy, energyMax, logger);

        // Before we move it to the discard pile, we check if the
        // card has to double its effect values
        // First we loop the card effects
        let syncCard = false;
        for (const effect of card.properties.effects) {
            // If is true, we double the values for the card
            // before moving it to the discard pile
            if (typeof effect.args.doubleValuesWhenPlayed !== 'undefined') {
                effect.args.value *= 2;
                if (typeof effect.times !== 'undefined') effect.times *= 2;
                syncCard = true;
            }

            // Also we check if the card has to lower its values every time is used
            if (typeof effect.args.decreaseValue !== 'undefined') {
                // We lower the value (won't be reduce below 1)
                const newValue = Math.max(
                    1,
                    effect.args.value - effect.args.decrementBy,
                );
                effect.args.value = newValue;
                syncCard = true;
            }
        }
        // Them add the card to the discard pile
        if (syncCard)
            await this.cardService.updateCardDescription({ ctx, card });

        // now, with all else done, do the actual exhaust/discard routines, without emitting again
        if (exhaust || forceExhaust) {
            await this.exhaustCardAction.handle({
                client: ctx.client,
                cardId,
                ctx,
                emit: false,
            });
        } else {
            await this.discardCardAction.handle({
                client: ctx.client,
                cardId,
                ctx,
                emit: false,
            });
        }

        logger.info(`Ended combat queue for client ${ctx.client.id}`);

        await this.combatQueueService.end(ctx);

        await this.eventEmitter.emitAsync(EVENT_AFTER_CARD_PLAY, {
            ctx,
            card,
            cardSource: source,
            cardSourceReference: sourceReference,
            cardTargetId: selectedEnemyId,
        });

        if (endTurn) await this.endPlayerTurnProcess.handle({ ctx });
    }

    private sendInvalidCardMessage(
        client: Socket,
        logger: pino.Logger<pino.LoggerOptions & pino.ChildLoggerOptions>,
    ): void {
        logger.error(
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

    private sendNotEnoughEnergyMessage(
        client: Socket,
        message: string,
        logger: pino.Logger<pino.LoggerOptions & pino.ChildLoggerOptions>,
    ): void {
        logger.error(
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
        logger: pino.Logger<pino.LoggerOptions & pino.ChildLoggerOptions>,
    ): void {
        logger.info(
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
