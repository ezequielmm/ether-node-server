import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CardKeywordPipeline } from '../cardKeywordPipeline/cardKeywordPipeline';
import {
    CardEnergyEnum,
    CardPlayErrorMessages,
} from '../components/card/card.enum';
import { CardId } from '../components/card/card.type';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { EffectService } from '../effects/effects.service';
import { TargetId } from '../effects/effects.types';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { DiscardCardAction } from './discardCard.action';
import { ExhaustCardAction } from './exhaustCard.action';
import { UpdatePlayerEnergyAction } from './updatePlayerEnergy.action';

interface CardPlayedDTO {
    readonly client: Socket;
    readonly cardId: CardId;
    readonly targetId: TargetId;
}

@Injectable()
export class CardPlayedAction {
    private readonly logger: Logger = new Logger(CardPlayedAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly effectService: EffectService,
        private readonly updatePlayerEnergyAction: UpdatePlayerEnergyAction,
        private readonly discardCardAction: DiscardCardAction,
        private readonly exhaustCardAction: ExhaustCardAction,
    ) {}

    async handle(payload: CardPlayedDTO): Promise<void> {
        const { client, cardId, targetId } = payload;

        // First make sure card exists on player's hand pile
        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            clientId: client.id,
            cardId,
        });

        if (!cardExists) {
            client.emit(
                'ErrorMessage',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.Error,
                        action: SWARAction.InvalidCard,
                        data: null,
                    }),
                ),
            );
            throw new WsException(
                StandardResponse.respond({
                    message_type: SWARMessageType.Error,
                    action: SWARAction.InvalidCard,
                    data: null,
                }),
            );
        } else {
            // If the card is valid we get the current node information
            // to validate the enemy
            const {
                data: {
                    enemies,
                    player: {
                        energy: availableEnergy,
                        cards: { hand },
                    },
                },
            } = await this.expeditionService.getCurrentNode({
                clientId: client.id,
            });

            // Next we validate that the enemy provided is valid
            const enemy = enemies.filter((enemy) => {
                const field = typeof targetId === 'string' ? 'id' : 'enemyId';

                return enemy[field] === targetId;
            })[0];

            if (!enemy) {
                client.emit(
                    'ErrorMessage',
                    JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.Error,
                            action: SWARAction.InvalidEnemy,
                            data: null,
                        }),
                    ),
                );
                throw new WsException(
                    StandardResponse.respond({
                        message_type: SWARMessageType.Error,
                        action: SWARAction.InvalidEnemy,
                        data: null,
                    }),
                );
            } else {
                // If everything goes right, we get the card information from
                // the player hand pile
                const {
                    energy: cardEnergyCost,
                    properties: { effects },
                    keywords,
                } = hand.filter((card) => {
                    const field = typeof cardId === 'string' ? 'id' : 'cardId';

                    return card[field] === cardId;
                })[0];

                // Next we make sure that the card can be played and the user has
                // enough energy
                const { canPlayCard, newEnergyAmount, message } =
                    this.canPlayerPlayCard(cardEnergyCost, availableEnergy);

                // next we inform the player that is not possible to play the card
                if (!canPlayCard) {
                    client.emit(
                        'ErrorMessage',
                        JSON.stringify(
                            StandardResponse.respond({
                                message_type: SWARMessageType.Error,
                                action: SWARAction.InsufficientEnergy,
                                data: message,
                            }),
                        ),
                    );
                    throw new WsException(
                        StandardResponse.respond({
                            message_type: SWARMessageType.Error,
                            action: SWARAction.InsufficientEnergy,
                            data: message,
                        }),
                    );
                } else {
                    // if the card can be played, we update the energy, apply the effects
                    // and move the card to the desired pile
                    await this.updatePlayerEnergyAction.handle({
                        clientId: client.id,
                        newEnergy: newEnergyAmount,
                    });

                    await this.effectService.process(
                        client.id,
                        effects,
                        targetId,
                    );

                    const { exhaust } = CardKeywordPipeline.process(keywords);

                    if (exhaust) {
                        await this.exhaustCardAction.handle({
                            clientId: client.id,
                            cardId,
                        });

                        this.logger.log(
                            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                        );

                        client.emit(
                            'PutData',
                            JSON.stringify(
                                StandardResponse.respond({
                                    message_type: SWARMessageType.EnemyAttacked,
                                    action: SWARAction.MoveCard,
                                    data: [
                                        {
                                            source: 'hand',
                                            destination: 'exhaust',
                                            cardId,
                                        },
                                    ],
                                }),
                            ),
                        );
                    } else {
                        await this.discardCardAction.handle({
                            clientId: client.id,
                            cardId,
                        });

                        this.logger.log(
                            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                        );

                        client.emit(
                            'PutData',
                            JSON.stringify(
                                StandardResponse.respond({
                                    message_type: SWARMessageType.EnemyAttacked,
                                    action: SWARAction.MoveCard,
                                    data: [
                                        {
                                            source: 'hand',
                                            destination: 'discard',
                                            cardId,
                                        },
                                    ],
                                }),
                            ),
                        );
                    }

                    const {
                        data: {
                            player: { energy, energyMax },
                            enemies,
                        },
                    } = await this.expeditionService.getCurrentNode({
                        clientId: client.id,
                    });

                    this.logger.log(
                        `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnergy}`,
                    );

                    client.emit(
                        'PutData',
                        JSON.stringify(
                            StandardResponse.respond({
                                message_type: SWARMessageType.EnemyAttacked,
                                action: SWARAction.UpdateEnergy,
                                data: [energy, energyMax],
                            }),
                        ),
                    );

                    this.logger.log(
                        `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnemy}`,
                    );

                    client.emit(
                        'PutData',
                        JSON.stringify(
                            StandardResponse.respond({
                                message_type: SWARMessageType.EnemyAttacked,
                                action: SWARAction.UpdateEnemy,
                                data: enemies,
                            }),
                        ),
                    );
                }
            }
        }
    }

    private canPlayerPlayCard(
        cardEnergyCost: number,
        availableEnergy: number,
    ): { canPlayCard: boolean; newEnergyAmount: number; message?: string } {
        // First we verify if the card has a 0 cost
        // if this is true, we allow the use of this card no matter the energy
        // the player has available
        if (cardEnergyCost === CardEnergyEnum.None)
            return {
                canPlayCard: true,
                newEnergyAmount: availableEnergy,
            };

        // If the card has a cost of -1, this means that the card will use all the available
        // energy that the player has, also the player energy needs to be more than 0
        if (cardEnergyCost === CardEnergyEnum.All && availableEnergy > 0)
            return {
                canPlayCard: true,
                newEnergyAmount: 0,
            };

        // If the card energy cost is higher than the player's available energy or the
        // player energy is 0 the player can't play the card
        if (cardEnergyCost > availableEnergy || availableEnergy === 0)
            return {
                canPlayCard: false,
                newEnergyAmount: availableEnergy,
                message: CardPlayErrorMessages.NoEnergyLeft,
            };

        // If the card energy cost is lower or equal than the player's available energy
        if (cardEnergyCost <= availableEnergy)
            return {
                canPlayCard: true,
                newEnergyAmount: availableEnergy - cardEnergyCost,
            };
    }
}
