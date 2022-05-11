import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';

@Injectable()
export class DiscardAllCards {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client_id: string): Promise<void> {
        await this.expeditionService.moveAllCardsToDiscardPile(client_id);
    }
}
