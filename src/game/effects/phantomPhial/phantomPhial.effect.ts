import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { MoveCardToHandAction } from 'src/game/action/moveCard.action';
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
        private readonly moveCardToHandAction: MoveCardToHandAction,
        private readonly historyService: HistoryService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;

        const cardsPlayed = _.filter(this.historyService.get(ctx.client.id), {
            type: 'card',
        }) as CardRegistry[];

        const cardIds = _.map(_.compact(_.take(cardsPlayed, 2)), 'id');

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
