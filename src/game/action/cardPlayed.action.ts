import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CardKeywordPipeline } from '../cardKeywordPipeline/cardKeywordPipeline';
import {
    CardEnergyEnum,
    CardPlayErrorMessages,
} from '../components/card/card.enum';
import { CardId, getCardIdField } from '../components/card/card.type';
import { IExpeditionCurrentNodeDataEnemy } from '../components/expedition/expedition.interface';
import { ExpeditionDocument } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Context } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { EffectService } from '../effects/effects.service';
import { TargetId } from '../effects/effects.types';
import { EndPlayerTurnProcess } from '../process/endPlayerTurn.process';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import {
    OnBeginCardPlayEventArgs,
    StatusEventType,
} from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { DiscardCardAction } from './discardCard.action';
import { ExhaustCardAction } from './exhaustCard.action';
import {
    GetPlayerInfoAction,
    PlayerInfoResponse,
} from './getPlayerInfo.action';
import { GetStatusesAction, GetStatusesResponse } from './getStatuses.action';

interface CardPlayedDTO {
    readonly client: Socket;
    readonly cardId: CardId;
    readonly targetId: TargetId;
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
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
        private readonly endPlayerTurnProcess: EndPlayerTurnProcess,
        private readonly getStatusesAction: GetStatusesAction,
        private readonly playerService: PlayerService,
    ) {}

    async handle(payload: CardPlayedDTO): Promise<void> {
        const { client, cardId, targetId } = payload;

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
                        round,
                    },
                },
            } = expedition;

            const ctx: Context = {
                client,
                expedition,
            };

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
                const source = EffectService.extractPlayerDTO(expedition);
                const sourceReference =
                    this.statusService.getReferenceFromSource(source);

                const onBeginCardPlayEventArgs: OnBeginCardPlayEventArgs = {
                    card,
                    cardSource: source,
                    cardSourceReference: sourceReference,
                    cardTargetId: targetId,
                };

                await this.statusService.trigger(
                    ctx,
                    StatusEventType.OnBeginCardPlay,
                    onBeginCardPlayEventArgs,
                );

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

                await this.effectService.applyAll({
                    ctx,
                    source,
                    effects,
                    selectedEnemy: targetId,
                });

                await this.statusService.attach({
                    ctx,
                    statuses,
                    currentRound: round,
                    sourceReference,
                    targetId,
                });

                const {
                    data: {
                        player: { energy, energyMax },
                        enemies,
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

                this.sendUpdateEnemiesMessage(enemies);

                const playerInfo = await this.getPlayerInfoAction.handle(
                    this.client.id,
                );

                this.sendUpdatePlayerMessage(playerInfo);

                await this.statusService.trigger(
                    ctx,
                    StatusEventType.OnEndCardPlay,
                    onBeginCardPlayEventArgs,
                );

                const statusData = await this.getStatusesAction.handle(
                    this.client.id,
                );

                this.sendStatusMessage(statusData);

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
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.Error,
                    action: SWARAction.InvalidCard,
                    data: null,
                }),
            ),
        );
    }

    private sendNotEnoughEnergyMessage(message: string): void {
        this.logger.log(
            `Sent message ErrorMessage to client ${this.client.id}: ${SWARAction.InsufficientEnergy}`,
        );

        this.client.emit(
            'ErrorMessage',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.Error,
                    action: SWARAction.InsufficientEnergy,
                    data: message,
                }),
            ),
        );
    }

    private sendUpdateEnergyMessage(energy: number, energyMax: number): void {
        this.logger.log(
            `Sent message PutData to client ${this.client.id}: ${SWARAction.UpdateEnergy}`,
        );

        this.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerAffected,
                    action: SWARAction.UpdateEnergy,
                    data: [energy, energyMax],
                }),
            ),
        );
    }

    private sendUpdateEnemiesMessage(
        enemies: IExpeditionCurrentNodeDataEnemy[],
    ): void {
        this.logger.log(
            `Sent message PutData to client ${this.client.id}: ${SWARAction.UpdateEnemy}`,
        );

        this.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EnemyAffected,
                    action: SWARAction.UpdateEnemy,
                    data: enemies,
                }),
            ),
        );
    }

    private sendUpdatePlayerMessage(playerInfo: PlayerInfoResponse): void {
        this.logger.log(
            `Sent message PutData to client ${this.client.id}: ${SWARAction.UpdatePlayerState}`,
        );

        this.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerAffected,
                    action: SWARAction.UpdatePlayer,
                    data: playerInfo,
                }),
            ),
        );
    }

    private sendStatusMessage(statusList: GetStatusesResponse[]): void {
        this.logger.log(
            `Sent message PutData to client ${this.client.id}: ${SWARAction.UpdateStatuses}`,
        );

        this.client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.UpdateStatuses,
                    data: statusList,
                }),
            ),
        );
    }
}
