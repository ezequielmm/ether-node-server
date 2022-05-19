import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../expedition/expedition.service';
import { IBaseEffect } from './interfaces/baseEffect';
import { DiscardCardDTO } from './dto';
import { GameManagerService } from '../gameManger/gameManager.service';
import { Activity } from '../elements/prototypes/activity';

@Injectable()
export class DiscardCardEffect implements IBaseEffect {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(payload: DiscardCardDTO): Promise<void> {
        const { client_id, card_id } = payload;

        await this.expeditionService.moveCardFromPlayerHandToDiscardPile(
            payload,
        );

        await this.gameManagerService.logActivity(
            client_id,
            new Activity('card', card_id, 'discard', undefined, [
                {
                    mod: 'mov',
                    source: 'current_node.data.player.cards.hand',
                    target: 'current_node.data.player.cards.discard',
                    prop: 'id',
                    val: card_id,
                    pos: 'append',
                },
            ]),
            {
                blockName: 'cardPlayed',
            },
        );
    }
}
