import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { IBaseEffect } from './interfaces/baseEffect';
import { DiscardAllCardsDTO } from './dto';

@Injectable()
export class DiscardAllCardsEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardAllCardsDTO): Promise<void> {
        const { client_id } = payload;
        await this.expeditionService.moveAllCardsToDiscardPile(client_id);
    }
}
