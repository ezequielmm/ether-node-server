import { GameManagerService } from './../gameManger/gameManager.service';
import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { IBaseEffect } from './interfaces/baseEffect';
import { DrawCardEffectDTO } from './dto';

@Injectable()
export class DrawCardEffect implements IBaseEffect {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(payload: DrawCardEffectDTO): Promise<void> {
        const { client_id, cards_to_take } = payload;
        await this.expeditionService.moveCardsFromDrawToHandPile(
            client_id,
            cards_to_take,
        );

        // TODO: Find a way to log the activity 🫡
    }
}
