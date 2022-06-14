import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/expedition/expedition.service';

@Injectable()
export class GetCardPilesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<string> {
        const {
            data: {
                player: {
                    cards: { exhausted, draw, discard, hand },
                },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        return JSON.stringify({ hand, draw, discard, exhausted });
    }
}
