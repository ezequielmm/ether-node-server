import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { EffectDecorator } from './effects.decorator';
import { Effect, EffectDTO, IBaseEffect } from './effects.interface';

export const drawCardEffect: Effect = {
    name: 'drawCard',
};

@EffectDecorator({
    effect: drawCardEffect,
})
@Injectable()
export class DrawCardEffect extends IBaseEffect {
    private readonly logger: Logger = new Logger(DrawCardEffect.name);

    constructor(private readonly expeditionService: ExpeditionService) {
        super();
    }

    async handle(payload: EffectDTO): Promise<void> {
        const {
            client,
            args: { currentValue },
        } = payload;
        // TODO: Triger draw card attempted event

        this.drawCard(client, currentValue);
    }

    private async drawCard(client: Socket, amount: number): Promise<void> {
        // Get cards from current node
        const {
            data: {
                player: {
                    cards: { draw, hand },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        const cardsToAdd = draw.slice(draw.length - amount);

        const newHand = [...hand, ...cardsToAdd];

        const newDraw = removeCardsFromPile({
            originalPile: draw,
            cardsToRemove: newHand,
        });

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: newHand,
            draw: newDraw,
        });

        const cardMoves = cardsToAdd.map((card) => {
            return {
                source: 'draw',
                destination: 'hand',
                cardId: card.id,
            };
        });

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerAffected,
                    action: SWARAction.MoveCard,
                    data: cardMoves,
                }),
            ),
        );
    }
}
