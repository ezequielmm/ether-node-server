import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/expedition/expedition.service';

interface DiscardAllCardsDTO {
    readonly client_id: string;
}

@Injectable()
export class DiscardAllCardsAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardAllCardsDTO) {
        const { client_id } = payload;
        await this.expeditionService.moveAllCardsToDiscardPile(client_id);
    }
}
