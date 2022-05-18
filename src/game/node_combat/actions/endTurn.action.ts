import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { DrawCardEffect } from 'src/game/effects/drawCard.effect';
import { DiscardAllCards } from 'src/game/effects/discardAllCards.effect';
import { UpdatePlayerEnergyEffect } from 'src/game/effects/updatePlayerEnergy.effect';

@Injectable()
export class EndTurnAction {
    constructor(
        private readonly drawCardEffect: DrawCardEffect,
        private readonly discardAllCards: DiscardAllCards,
        private readonly updatePlayerEnergyEffect: UpdatePlayerEnergyEffect,
    ) {}

    async handle(client: Socket): Promise<string> {
        await this.discardAllCards.handle({ client_id: client.id });

        await this.drawCardEffect.handle({
            client_id: client.id,
            cards_to_take: 5,
        });

        const current_node = await this.updatePlayerEnergyEffect.handle({
            client_id: client.id,
            energy: 3,
        });

        return JSON.stringify({ data: current_node });
    }
}
