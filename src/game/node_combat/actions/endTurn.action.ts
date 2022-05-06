import { ExpeditionService } from '../../expedition/expedition.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EndTurnAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<string> {
        await this.expeditionService.moveAllCardsToDiscardPile(client.id);

        await this.expeditionService.moveCardsFromDrawToHandPile(client.id);

        const { current_node } =
            await this.expeditionService.updatePlayerEnergy({
                client_id: client.id,
                energy: 3,
            });

        return JSON.stringify({ data: current_node });
    }
}
