import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { CardKeywordPipeline } from '../cardKeywordPipeline/cardKeywordPipeline';
import {
    CardEnergyEnum,
    CardPlayErrorMessages,
} from '../components/card/card.enum';
import { CardId, getCardIdField } from '../components/card/card.type';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { ExpeditionDocument } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context } from '../components/interfaces';
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

interface CardPlayedDTO {
    readonly client: Socket;
    readonly cardId: CardId;
    readonly selectedEnemyId: TargetId;
}

interface ICanPlayCard {
    readonly canPlayCard: boolean;
    readonly message?: string;
}

@Injectable()
export class CardPlayedAction {
    private readonly logger: Logger = new Logger(CardPlayedAction.name);

    private client: Socket;

    constructor(
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

    async handle(payload: CardPlayedDTO): Promise<void> {
        const { client, cardId, selectedEnemyId } = payload;

        this.client = client;

        // First make sure card exists on player's hand pile
        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            clientId: this.client.id,
            cardId,
        });

        if (!cardExists) {
            this.sendInvalidCardMessage();
        } else {
            // If the card is valid we get the current node information
            // to validate the enemy
            const expedition = await this.expeditionService.findOne({
                clientId: this.client.id,
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

            const ctx: Context = {
                client,
                expedition,
            };

            this.logger.debug(`Started combat queue for client ${client.id}`);
            await this.combatQueueService.start(ctx);

            // If everything goes right, we get the card information from
            // the player hand pile
            const card = hand.find((card) => {
                const field = getCardIdField(cardId);

                return card[field] === cardId;
            });

            const {
                energy: cardEnergyCost,
                properties: { effects, statuses },
                keywords,
            } = card;

            const { exhaust, endTurn } = CardKeywordPipeline.process(keywords);

            // Next we make sure that the card can be played and the user has
            // enough energy
            const { canPlayCard, message } = this.canPlayerPlayCard(
                cardEnergyCost,
                availableEnergy,
            );

            // next we inform the player that is not possible to play the card
            if (!canPlayCard) {
                this.sendNotEnoughEnergyMessage(message);
            } else {
                this.logger.verbose(
                    `Player ${client.id} played card: ${card.name}`,
                );

                const source = this.playerService.get(ctx);
                const sourceReference =
                    this.statusService.getReferenceFromEntity(source);

                this.historyService.register({
                    clientId: this.client.id,
                    registry: {
                        type: 'card',
                        source,
                        card,
                    },
                });

                await this.eventEmitter.emitAsync(EVENT_BEFORE_CARD_PLAY, {
                    ctx,
                    card,
                    cardSource: source,
                    cardSourceReference: sourceReference,
                    cardTargetId: selectedEnemyId,
                });

                await this.effectService.applyAll({
                    ctx,
                    source,
                    effects,
                    selectedEnemy: selectedEnemyId,
                });

                // if the card can be played, we update the energy, apply the effects
                // and move the card to the desired pile
                if (exhaust) {
                    await this.exhaustCardAction.handle({
                        client: this.client,
                        cardId,
                    });
                } else {
                    await this.discardCardAction.handle({
                        client: this.client,
                        cardId,
                    });
                }

                // After applying the effects, check if the current
                // combat has ended and if so, skip all next steps
                if (this.expeditionService.isCurrentCombatEnded(ctx)) {
                    this.logger.debug(
                        'Current node is completed. Skipping next actions',
                    );
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
                    clientId: client.id,
                });

                const newEnergy = energy - cardEnergyCost;

                await this.playerService.setEnergy(
                    { client, expedition: expedition as ExpeditionDocument },
                    newEnergy,
                );

                this.sendUpdateEnergyMessage(newEnergy, energyMax);

                this.logger.debug(`Ended combat queue for client ${client.id}`);
                await this.combatQueueService.end(ctx);

                await this.eventEmitter.emitAsync(EVENT_AFTER_CARD_PLAY, {
                    ctx,
                    card,
                    cardSource: source,
                    cardSourceReference: sourceReference,
                    cardTargetId: selectedEnemyId,
                });

                if (endTurn)
                    await this.endPlayerTurnProcess.handle({
                        client: this.client,
                    });
            }
        }
    }

    private canPlayerPlayCard(
        cardEnergyCost: number,
        availableEnergy: number,
    ): ICanPlayCard {
        // First we verify if the card has a 0 cost
        // if this is true, we allow the use of this card no matter the energy
        // the player has available
        if (cardEnergyCost === CardEnergyEnum.None)
            return {
                canPlayCard: true,
            };

        // If the card has a cost of -1, this means that the card will use all the available
        // energy that the player has, also the player energy needs to be more than 0
        if (cardEnergyCost === CardEnergyEnum.All && availableEnergy > 0)
            return {
                canPlayCard: true,
            };

        // If the card energy cost is higher than the player's available energy or the
        // player energy is 0 the player can't play the card
        if (cardEnergyCost > availableEnergy || availableEnergy === 0)
            return {
                canPlayCard: false,
                message: CardPlayErrorMessages.NoEnergyLeft,
            };

        // If the card energy cost is lower or equal than the player's available energy
        if (cardEnergyCost <= availableEnergy)
            return {
                canPlayCard: true,
            };
    }

    private sendInvalidCardMessage(): void {
        this.logger.error(
            `Sent message ErrorMessage to client ${this.client.id}: ${SWARAction.InvalidCard}`,
        );

        this.client.emit(
            'ErrorMessage',
            StandardResponse.respond({
                message_type: SWARMessageType.Error,
                action: SWARAction.InvalidCard,
                data: null,
            }),
        );
    }

    private sendNotEnoughEnergyMessage(message: string): void {
        this.logger.debug(
            `Sent message ErrorMessage to client ${this.client.id}: ${SWARAction.InsufficientEnergy}`,
        );

        this.client.emit(
            'ErrorMessage',
            StandardResponse.respond({
                message_type: SWARMessageType.Error,
                action: SWARAction.InsufficientEnergy,
                data: message,
            }),
        );
    }

    private sendUpdateEnergyMessage(energy: number, energyMax: number): void {
        this.logger.debug(
            `Sent message PutData to client ${this.client.id}: ${SWARAction.UpdateEnergy}`,
        );

        this.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.UpdateEnergy,
                data: [energy, energyMax],
            }),
        );
    }
}
