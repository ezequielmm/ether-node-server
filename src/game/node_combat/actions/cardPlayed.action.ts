import { GameManagerService } from 'src/game/gameManger/gameManager.service';
import { ExpeditionService } from '../../expedition/expedition.service';
import { CardService } from '../../components/card/card.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { DiscardCardEffect } from 'src/game/effects/discardCard.effect';
import {
    CardEnergyEnum,
    CardPlayErrorMessages,
} from 'src/game/components/card/enums';
import { UpdatePlayerEnergyEffect } from 'src/game/effects/updatePlayerEnergy.effect';
import { Activity } from 'src/game/elements/prototypes/activity';

@Injectable()
export class CardPlayedAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly discardCardEffect: DiscardCardEffect,
        private readonly updatePlayerEnergyEffect: UpdatePlayerEnergyEffect,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(client: Socket, card_id: string): Promise<string> {
        const action = await this.gameManagerService.startAction(
            client.id,
            'cardPlayed',
        );

        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            client_id: client.id,
            card_id,
        });

        // First make sure card exists on player's hand pile

        if (!cardExists)
            return JSON.stringify({
                data: { message: 'Card played is not valid' },
            });

        // Then, we query the card info to get its energy cost
        const { energy: cardEnergy } = await this.cardService.findById(card_id);

        // Then, we get the actual energy amount from the current state
        const {
            data: {
                player: { energy: playerEnergy },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        const { canPlayCard, newEnergyAmount, message } =
            this.canPlayerPlayCard(cardEnergy, playerEnergy);

        if (!canPlayCard)
            return JSON.stringify({
                data: { message },
            });

        await this.discardCardEffect.handle({
            client_id: client.id,
            card_id,
        });

        await this.updatePlayerEnergyEffect.handle({
            client_id: client.id,
            energy: newEnergyAmount,
        });

        action.log(
            new Activity('energy', undefined, 'decrease', undefined, [
                {
                    mod: 'set',
                    key: 'current_node.data.player.energy',
                    val: newEnergyAmount,
                },
            ]),
            {
                blockName: 'cardPlayed',
            },
        );

        return JSON.stringify(await action.end());
    }

    private canPlayerPlayCard(
        cardEnergyAmount: number,
        playerEnergy: number,
    ): {
        canPlayCard: boolean;
        newEnergyAmount: number;
        message?: string;
    } {
        // First we verify if the card has a 0 cost and the player has 0 energy.
        // if this is true, we allow the use of this card
        if (cardEnergyAmount === CardEnergyEnum.None && playerEnergy === 0) {
            return {
                canPlayCard: true,
                newEnergyAmount: playerEnergy,
            };
        }

        // If the card has a cost of -1, this means that the card will use all the available
        // energy that the player has, also the player energy needs to be more than 0
        if (cardEnergyAmount === CardEnergyEnum.All && playerEnergy > 0) {
            return {
                canPlayCard: true,
                newEnergyAmount: 0,
            };
        }

        // If the card energy cost is higher than the player's available energy or the
        // player energy is 0 the player can't play the card
        if (cardEnergyAmount > playerEnergy || playerEnergy === 0) {
            return {
                canPlayCard: false,
                newEnergyAmount: playerEnergy,
                message: CardPlayErrorMessages.NoEnergyLeft,
            };
        }

        // If the card energy cost is lower or equal than the player's available energy
        if (cardEnergyAmount <= playerEnergy) {
            return {
                canPlayCard: true,
                newEnergyAmount: playerEnergy - cardEnergyAmount,
            };
        }
    }
}
