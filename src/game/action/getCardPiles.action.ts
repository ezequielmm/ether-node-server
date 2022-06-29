import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';

interface GetCardPilesResponse {
    hand: IExpeditionPlayerStateDeckCard[];
    draw: IExpeditionPlayerStateDeckCard[];
    discard: IExpeditionPlayerStateDeckCard[];
    exhausted: IExpeditionPlayerStateDeckCard[];
    energy: number;
    energyMax: number;
}

@Injectable()
export class GetCardPilesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<GetCardPilesResponse> {
        const {
            data: {
                player: {
                    energy,
                    energyMax,
                    cards: { exhausted, draw, discard, hand },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        return { draw, discard, energy, energyMax, exhausted, hand };
    }
}
