import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { DrawCardEffect } from 'src/game/effects/drawCard.effect';
import { DiscardAllCardsEffect } from 'src/game/effects/discardAllCards.effect';
import { UpdatePlayerEnergyEffect } from 'src/game/effects/updatePlayerEnergy.effect';
import { TurnChangeEffect } from 'src/game/effects/turnChange.effect';

@Injectable()
export class EndTurnAction {
    constructor(
        private readonly drawCardEffect: DrawCardEffect,
        private readonly discardAllCardsEffect: DiscardAllCardsEffect,
        private readonly updatePlayerEnergyEffect: UpdatePlayerEnergyEffect,
        private readonly turnChangeEffect: TurnChangeEffect,
    ) {}

    async handle(client: Socket): Promise<string> {
        await this.discardAllCardsEffect.handle({ client_id: client.id });

        await this.drawCardEffect.handle({
            client_id: client.id,
            cards_to_take: 5,
        });

        const current_node = await this.updatePlayerEnergyEffect.handle({
            client_id: client.id,
            energy: 3,
        });

        await this.turnChangeEffect.handle({ client_id: client.id });

        return JSON.stringify({ data: current_node });
    }
}
