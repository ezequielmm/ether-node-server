import { ExpeditionService } from '../../expedition/expedition.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { DrawCardEffect } from 'src/game/effects/drawCard.effect';
import { DiscardAllCards } from 'src/game/effects/discardAllCards.effect';

@Injectable()
export class EndTurnAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly drawCardEffect: DrawCardEffect,
        private readonly discardAllCards: DiscardAllCards,
    ) {}

    async handle(client: Socket): Promise<string> {
        await this.discardAllCards.handle(client.id);

        await this.drawCardEffect.handle(client.id);

        const { current_node } =
            await this.expeditionService.updatePlayerEnergy({
                client_id: client.id,
                energy: 3,
            });

        return JSON.stringify({ data: current_node });
    }
}
