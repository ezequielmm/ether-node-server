import { ExpeditionService } from '../../components/expedition/expedition.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';

export interface CardPlayedDTO {
    readonly client: Socket;
    readonly card_id: string | number;
    readonly target: string | number;
}

@Injectable()
export class CardPlayedAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: CardPlayedDTO): Promise<void> {
        const { client, card_id, target } = payload;

        // First make sure card exists on player's hand pile
        const cardExists = await this.expeditionService.cardExistsOnPlayerHand({
            client_id: client.id,
            card_id,
        });

        if (!cardExists)
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

        // Next we validate that the enemy provided is valid
        const enemyExists =
            await this.expeditionService.enemyExistsOnCurrentNode({
                client_id: client.id,
                enemy_id: target,
            });

        if (!enemyExists)
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

        // If everything goes right, we get the card information from
        // the player hand pile
        const {
            properties: { effects },
        } = await this.expeditionService.getCardFromPlayerHand({
            client_id: client.id,
            card_id,
        });

        // We verify the card effect and check its effects
    }
}
