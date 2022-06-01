import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { IBaseEffect } from './interfaces/baseEffect';
import { DiscardAllCardsDTO } from './dto';
import { GameManagerService } from '../gameManager/gameManager.service';
import { Activity } from '../elements/prototypes/activity';

@Injectable()
export class DiscardAllCardsEffect implements IBaseEffect {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(payload: DiscardAllCardsDTO): Promise<void> {
        const { client_id } = payload;
        const expedition =
            await this.expeditionService.moveAllCardsToDiscardPile(client_id);

        await this.gameManagerService.logActivity(
            client_id,
            new Activity('card', undefined, 'discard-all-cards', undefined, [
                {
                    mod: 'set',
                    key: 'current_node.data.player.cards.hand',
                    val: expedition.current_node.data.player.cards.hand,
                },
                {
                    mod: 'set',
                    key: 'current_node.data.player.cards.discard',
                    val: expedition.current_node.data.player.cards.discard,
                },
            ]),
        );
    }
}
