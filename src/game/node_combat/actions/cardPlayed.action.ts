import { ExpeditionService } from '../../components/expedition/expedition.service';
import { CardService } from '../../components/card/card.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { EffectService } from 'src/game/effects/effect.service';
import { ExhaustCardAction } from './exhaustCard.action';
import { DiscardCardAction } from './discardCard.action';
import { UpdatePlayerEnergyAction } from './updatePlayerEnergy.action';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';

export interface CardPlayedDTO {
    readonly client: Socket;
    readonly card_id: string | number;
    readonly target: string[] | number[];
}

@Injectable()
export class CardPlayedAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly effectService: EffectService,
        private readonly exhaustCardAction: ExhaustCardAction,
        private readonly discardCardAction: DiscardCardAction,
        private readonly updatePlayerEnergyAction: UpdatePlayerEnergyAction,
    ) {}

    async handle(payload: CardPlayedDTO): Promise<void> {
        const { client, card_id } = payload;

        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            client_id: client.id,
            card_id,
        });

        // First make sure card exists on player's hand pile
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
        }

        // if the card exists, it gets its information from the hand pile
    }
}
