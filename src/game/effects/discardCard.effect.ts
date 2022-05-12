import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { IBaseEffect } from './interfaces/baseEffect';
import { DiscardCardDTO } from './dto';

@Injectable()
export class DiscardCardEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardCardDTO): Promise<void> {
        await this.expeditionService.moveCardFromPlayerHandToDiscardPile(
            payload,
        );
    }
}
