import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

interface ExhaustCardDTO {
    readonly client_id: string;
    readonly card_id: string;
}

@Injectable()
export class ExhaustCardAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: ExhaustCardDTO) {
        await this.expeditionService.moveCardFromPlayerHandToExhaustPile(
            payload,
        );
    }
}
