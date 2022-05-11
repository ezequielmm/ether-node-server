import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';

@Injectable()
export class DiscardCardEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client_id: string, card_id: string): Promise<void> {
        await this.expeditionService.moveCardFromPlayerHandToDiscardPile({
            client_id,
            card_id,
        });
    }
}
