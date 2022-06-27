import { ExpeditionService } from '../../components/expedition/expedition.service';
import { Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import {
    CardEnergyEnum,
    CardPlayErrorMessages,
} from 'src/game/components/card/enums';
import { UpdatePlayerEnergyAction } from './updatePlayerEnergy.action';
import { DiscardCardAction } from './discardCard.action';
import { EffectService } from 'src/game/effects/effect.service';

export interface CardPlayedDTO {
    readonly client: Socket;
    readonly card_id: string | number;
    readonly target: string | number;
}

@Injectable()
export class CardPlayedAction {
    private readonly logger: Logger = new Logger(CardPlayedAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly updatePlayerEnergyAction: UpdatePlayerEnergyAction,
        private readonly discardCardAction: DiscardCardAction,
        private readonly effectService: EffectService,
    ) {}

    async handle(payload: CardPlayedDTO): Promise<void> {
        const { client, card_id, target } = payload;

        // First make sure card exists on player's hand pile
        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            client_id: client.id,
            card_id,
        });

        if (!cardExists) {
            client.emit(
                'ErrorMessage',
                JSON.stringify(
                    StandardResponse.createResponse({
                        message_type: SWARMessageType.Error,
                        action: SWARAction.InvalidCard,
                        data: null,
                    }),
                ),
            );
            return;
        }

        // Next we validate that the enemy provided is valid
        const enemyExists =
            await this.expeditionService.enemyExistsOnCurrentNode({
                client_id: client.id,
                enemy_id: target,
            });

        if (!enemyExists) {
            client.emit(
                'ErrorMessage',
                JSON.stringify(
                    StandardResponse.createResponse({
                        message_type: SWARMessageType.Error,
                        action: SWARAction.InvalidEnemy,
                        data: null,
                    }),
                ),
            );
            return;
        }

        // If everything goes right, we get the card information from
        // the player hand pile
        const {
            energy: cardEnergyCost,
            properties: { effects },
        } = await this.expeditionService.getCardFromPlayerHand({
            client_id: client.id,
            card_id,
        });

        // We get the current energy amount available from the current node
        const {
            data: {
                player: { energy: availableEnergy },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        // Next we make sure that the card can be played and the user has
        // enough energy
        const { canPlayCard, newEnergyAmount, message } =
            this.canPlayerPlayCard(cardEnergyCost, availableEnergy);

        if (!canPlayCard) {
            client.emit(
                'ErrorMessage',
                JSON.stringify(
                    StandardResponse.createResponse({
                        message_type: SWARMessageType.Error,
                        action: SWARAction.InsufficientEnergy,
                        data: message,
                    }),
                ),
            );
            return;
        } else {
            await this.updatePlayerEnergyAction.handle({
                client_id: client.id,
                energy: newEnergyAmount,
            });

            await this.effectService.process(client.id, effects, target);

            await this.discardCardAction.handle({
                client_id: client.id,
                card_id,
            });

            const {
                data: {
                    player: { energy, energy_max },
                    enemies,
                },
            } = await this.expeditionService.getCurrentNodeByClientId(
                client.id,
            );

            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnergy}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.createResponse({
                        message_type: SWARMessageType.EnemyAttacked,
                        action: SWARAction.UpdateEnergy,
                        data: [energy, energy_max],
                    }),
                ),
            );

            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.createResponse({
                        message_type: SWARMessageType.EnemyAttacked,
                        action: SWARAction.MoveCard,
                        data: [
                            { source: 'hand', destination: 'discard', card_id },
                        ],
                    }),
                ),
            );

            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.UpdateEnemy}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.createResponse({
                        message_type: SWARMessageType.EnemyAttacked,
                        action: SWARAction.UpdateEnemy,
                        data: enemies,
                    }),
                ),
            );
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
