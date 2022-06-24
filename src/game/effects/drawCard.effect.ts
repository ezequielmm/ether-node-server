import { GameManagerService } from './../gameManager/gameManager.service';
import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { EffectName, IBaseEffect } from './interfaces/baseEffect';
import { DrawCardEffectDTO } from './dto';
import { Effect } from './decorators/effect.decorator';

@Effect(EffectName.DrawCard)
@Injectable()
export class DrawCardEffect implements IBaseEffect {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(payload: DrawCardEffectDTO): Promise<void> {
        await this.expeditionService.moveCardsFromDrawToHandPile(payload);
        // Implement new response here
    }
}
