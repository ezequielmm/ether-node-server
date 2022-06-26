import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { IExpeditionPlayerStateDeckCard } from 'src/game/expedition/interfaces';

export interface GetCardPilesResponse {
    hand: IExpeditionPlayerStateDeckCard[];
    draw: IExpeditionPlayerStateDeckCard[];
    discard: IExpeditionPlayerStateDeckCard[];
    exhausted: IExpeditionPlayerStateDeckCard[];
    energy: number;
    energy_max: number;
}

@Injectable()
export class GetCardPilesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<GetCardPilesResponse> {
        const {
            data: {
                player: {
                    energy,
                    energy_max,
                    cards: { exhausted, draw, discard, hand },
                },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        return { draw, discard, energy, energy_max, exhausted, hand };
    }
}
