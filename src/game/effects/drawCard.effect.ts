import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';

@Injectable()
export class DrawCardEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client_id: string, cards_to_take = 5): Promise<void> {
        await this.expeditionService.moveCardsFromDrawToHandPile(
            client_id,
            cards_to_take,
        );
    }
}
