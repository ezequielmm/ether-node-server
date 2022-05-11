import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { IBaseEffect } from './baseEffect';
import { DiscardCardDTO } from './dto';

@Injectable()
export class DiscardCardEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardCardDTO): Promise<void> {
        const { client_id, card_id } = payload;
        await this.expeditionService.moveCardFromPlayerHandToDiscardPile({
            client_id,
            card_id,
        });
    }
}
