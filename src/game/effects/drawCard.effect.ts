import { Injectable } from '@nestjs/common';
import { removeCardsFromPile } from 'src/utils';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Effect } from './effects.decorator';
import { EffectName } from './effects.enum';
import { DrawCardDTO, IBaseEffect } from './effects.interface';

@Effect(EffectName.DrawCard)
@Injectable()
export class DrawCardEffect implements IBaseEffect {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DrawCardDTO): Promise<void> {
        const { clientId, times, calculatedValue } = payload;
        // TODO: Triger draw card attempted event

        for (let i = 1; i <= times; i++) {
            this.drawCard(clientId, calculatedValue);
        }
    }

    private async drawCard(clientId: string, amount: number): Promise<void> {
        // Get cards from current node
        const {
            data: {
                player: {
                    cards: { draw, hand },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: clientId,
        });

        const cards = draw.slice(draw.length - amount);

        const newHand = [...hand, ...cards];

        const newDraw = removeCardsFromPile({
            originalPile: draw,
            cardsToRemove: newHand,
        });

        await this.expeditionService.updateHandPiles({
            clientId,
            hand: newHand,
            draw: newDraw,
        });
    }
}
