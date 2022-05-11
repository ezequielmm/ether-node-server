import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { IBaseEffect } from './baseEffect';
import { DrawCardEffectDTO } from './dto';

@Injectable()
export class DrawCardEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DrawCardEffectDTO): Promise<void> {
        const { client_id, cards_to_take } = payload;
        await this.expeditionService.moveCardsFromDrawToHandPile(
            client_id,
            cards_to_take,
        );
    }
}
