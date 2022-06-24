import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

@Injectable()
export class GetCardPilesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<string> {
        const {
            data: {
                player: {
                    energy,
                    energy_max,
                    cards: { exhausted, draw, discard, hand },
                },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        return JSON.stringify({
            data: { hand, draw, discard, exhausted, energy, energy_max },
        });
    }
}
