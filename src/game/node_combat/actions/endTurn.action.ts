import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { GameManagerService } from 'src/game/gameManager/gameManager.service';
import { DiscardAllCardsAction } from './discardAllCards.action';
import { DrawCardEffect } from 'src/game/effects/drawCard.effect';
import { UpdatePlayerEnergyAction } from './updatePlayerEnergy.action';
import { TurnChangeAction } from './turnChange.action';

@Injectable()
export class EndTurnAction {
    constructor(
        private readonly gameManagerService: GameManagerService,
        private readonly discardAllCardsAction: DiscardAllCardsAction,
        private readonly updatePlayerEnergyAction: UpdatePlayerEnergyAction,
        private readonly turnChangeAction: TurnChangeAction,
        private readonly drawCardEffect: DrawCardEffect,
    ) {}

    async handle(client: Socket): Promise<string> {
        const action = await this.gameManagerService.startAction(
            client.id,
            'endTurn',
        );

        await this.discardAllCardsAction.handle({ client_id: client.id });

        await this.drawCardEffect.handle({
            client_id: client.id,
            cards_to_take: 5,
        });

        await this.updatePlayerEnergyAction.handle({
            client_id: client.id,
            energy: 3,
        });

        await this.turnChangeAction.handle({ client_id: client.id });

        const response = await action.end();

        return JSON.stringify(response);
    }
}
