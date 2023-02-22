import { Injectable } from '@nestjs/common';
import { filter, sample } from 'lodash';
import { MoveCardAction } from 'src/game/action/moveCard.action';
import { CardTypeEnum } from 'src/game/components/card/card.enum';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { pavaRootEffect } from './constants';

@EffectDecorator({
    effect: pavaRootEffect,
})
@Injectable()
export class PavaRootEffect implements EffectHandler {
    constructor(private readonly moveCardAction: MoveCardAction) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;

        const drawCards = ctx.expedition.currentNode.data.player.cards.draw;

        const attackCard = sample(
            filter(drawCards, {
                cardType: CardTypeEnum.Attack,
            }),
        );

        if (attackCard) {
            await this.moveCardAction.handle({
                client: ctx.client,
                cardIds: [attackCard.id],
                originPile: 'draw',
                targetPile: 'hand',
                callback: (card) => {
                    card.energy = 0;
                    return card;
                },
            });
        }
    }
}
