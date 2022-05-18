import { Activity } from 'src/game/elements/prototypes/activity';
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
        const expedition =
            await this.expeditionService.moveCardsFromDrawToHandPile(
                client_id,
                cards_to_take,
            );

        this.gameManagerService.logActivity(
            client_id,
            new Activity(
                'cards',
                undefined,
                'move-from-draw-to-hand',
                {
                    cards_to_take,
                },
                [
                    {
                        mod: 'set',
                        key: 'node.data.player.cards.hand',
                        val: expedition.current_node.data.player.cards.hand,
                    },
                    {
                        mod: 'set',
                        key: 'node.data.player.cards.draw',
                        val: expedition.current_node.data.player.cards.draw,
                    },
                ],
            ),
        );
    }
}
