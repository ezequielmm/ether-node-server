import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { IBaseEffect } from './interfaces/baseEffect';
import { DrawCardEffectDTO } from './dto';

@Injectable()
export class DrawCardEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DrawCardEffectDTO): Promise<void> {
        await this.expeditionService.moveCardsFromDrawToHandPile(payload);
    }
}
