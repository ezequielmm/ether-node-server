import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { DrawCardEffect } from 'src/game/effects/drawCard.effect';
import { DiscardAllCardsEffect } from 'src/game/effects/discardAllCards.effect';
import { UpdatePlayerEnergyEffect } from 'src/game/effects/updatePlayerEnergy.effect';
import { TurnChangeEffect } from 'src/game/effects/turnChange.effect';
import { GameManagerService } from 'src/game/gameManager/gameManager.service';

@Injectable()
export class EndTurnAction {
    constructor(
        private readonly drawCardEffect: DrawCardEffect,
        private readonly discardAllCardsEffect: DiscardAllCardsEffect,
        private readonly updatePlayerEnergyEffect: UpdatePlayerEnergyEffect,
        private readonly turnChangeEffect: TurnChangeEffect,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(client: Socket): Promise<string> {
        const action = await this.gameManagerService.startAction(
            client.id,
            'endTurn',
        );

        await this.discardAllCardsEffect.handle({ client_id: client.id });

        await this.drawCardEffect.handle({
            client_id: client.id,
            cards_to_take: 5,
        });

        await this.updatePlayerEnergyEffect.handle({
            client_id: client.id,
            energy: 3,
        });

        await this.turnChangeEffect.handle({ client_id: client.id });

        const response = await action.end();

        return JSON.stringify(response);
    }
}
