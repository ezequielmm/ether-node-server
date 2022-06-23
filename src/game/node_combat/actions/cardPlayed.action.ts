import { ExpeditionService } from '../../expedition/expedition.service';
import { CardService } from '../../components/card/card.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import {
    CardEnergyEnum,
    CardPlayErrorMessages,
} from 'src/game/components/card/enums';
import { EffectService } from 'src/game/effects/effect.service';
import { ExhaustCardAction } from './exhaustCard.action';
import { DiscardCardAction } from './discardCard.action';
import { UpdatePlayerEnergyAction } from './updatePlayerEnergy.action';
import {
    StandardResponseService,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse.service';
import { CardKeywordPipelineService } from 'src/game/cardKeywordPipeline/cardKeywordPipeline.service';

@Injectable()
export class CardPlayedAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly effectService: EffectService,
        private readonly exhaustCardAction: ExhaustCardAction,
        private readonly discardCardAction: DiscardCardAction,
        private readonly updatePlayerEnergyAction: UpdatePlayerEnergyAction,
        private readonly standardResponseService: StandardResponseService,
        private readonly cardkeywordPipelineService: CardKeywordPipelineService,
    ) {}

    async handle(client: Socket, card_id: string): Promise<void> {
        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            client_id: client.id,
            card_id,
        });

        // First make sure card exists on player's hand pile
        if (!cardExists) {
            client.emit(
                'ErrorMessage',
                JSON.stringify(
                    this.standardResponseService.createResponse({
                        message_type: SWARMessageType.Error,
                        action: SWARAction.InvalidCard,
                        data: null,
                    }),
                ),
            );
        }

        // Then, we query the card info to get its energy cost
        const {
            energy: cardEnergy,
            keywords,
            properties,
        } = await this.cardService.findById(card_id);

        const { unplayable, exhaust, retain } =
            this.cardkeywordPipelineService.process(keywords);

        if (unplayable) {
            client.emit(
                'ErrorMessage',
                JSON.stringify(
                    this.standardResponseService.createResponse({
                        message_type: SWARMessageType.Error,
                        action: SWARAction.UnplayableCard,
                        data: null,
                    }),
                ),
            );
        }

        this.effectService.process(client.id, properties.effects);

        // Then, we get the actual energy amount from the current state
        const {
            data: {
                player: { energy: playerEnergy },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        const { canPlayCard, newEnergyAmount } = this.canPlayerPlayCard(
            cardEnergy,
            playerEnergy,
        );

        if (!canPlayCard) {
            client.emit(
                'ErrorMessage',
                JSON.stringify(
                    this.standardResponseService.createResponse({
                        message_type: SWARMessageType.Error,
                        action: SWARAction.UnplayableCard,
                        data: null,
                    }),
                ),
            );
        }

        if (exhaust) {
            await this.exhaustCardAction.handle({
                client_id: client.id,
                card_id,
            });
        } else if (!retain) {
            await this.discardCardAction.handle({
                client_id: client.id,
                card_id,
            });
        }

        await this.updatePlayerEnergyAction.handle({
            client_id: client.id,
            energy: newEnergyAmount,
        });
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
        if (cardEnergyAmount === CardEnergyEnum.None) {
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
