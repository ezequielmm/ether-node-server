import { Injectable } from '@nestjs/common';
import { compact, filter, map, take } from 'lodash';
import { MoveCardAction } from 'src/game/action/moveCard.action';
import { CardSelectionScreenOriginPileEnum } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.enum';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { phantomPhialEffect } from './constants';

@EffectDecorator({
    effect: phantomPhialEffect,
})
@Injectable()
export class PhantomPhialEffect implements EffectHandler {
    constructor(
        private readonly moveCardToHandAction: MoveCardAction,
        private readonly historyService: HistoryService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;

        const cardsPlayed = filter(this.historyService.get(ctx.client.id), {
            type: 'card',
        }) as CardRegistry[];

        const cardIds = map(compact(take(cardsPlayed, 2)), 'id');

        await this.moveCardToHandAction.handle({
            client: ctx.client,
            cardIds,
            callback: (card) => {
                card.energy = 0;
                return card;
            },
            originPile: CardSelectionScreenOriginPileEnum.Discard,
        });
    }
}
