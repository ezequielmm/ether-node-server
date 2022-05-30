import { Injectable } from '@nestjs/common';
import { Activity } from '../elements/prototypes/activity';
import { ExpeditionService } from '../expedition/expedition.service';
import { GameManagerService } from '../gameManager/gameManager.service';
import { ExhaustCardDTO } from './dto';
import { IBaseEffect } from './interfaces/baseEffect';

@Injectable()
export class ExhaustCardEffect implements IBaseEffect {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(payload: ExhaustCardDTO): Promise<void> {
        const { client_id, card_id } = payload;

        await this.expeditionService.moveCardFromPlayerHandToExhaustPile(
            payload,
        );

        await this.gameManagerService.logActivity(
            client_id,
            new Activity('card', card_id, 'exhaust', undefined, [
                {
                    mod: 'mov',
                    source: 'current_node.data.player.cards.hand',
                    target: 'current_node.data.player.cards.exhaust',
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
