import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

interface DiscardCardDTO {
    readonly client_id: string;
    readonly card_id: string;
}

@Injectable()
export class DiscardCardAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardCardDTO) {
        await this.expeditionService.moveCardFromPlayerHandToDiscardPile(
            payload,
        );
    }
}
