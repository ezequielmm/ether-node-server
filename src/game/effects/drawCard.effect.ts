import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { Effect } from './effects.decorator';
import { EffectName } from './effects.enum';
import { DrawCardDTO, IBaseEffect } from './effects.interface';

@Effect(EffectName.DrawCard)
@Injectable()
export class DrawCardEffect implements IBaseEffect {
    private readonly logger: Logger = new Logger(DrawCardEffect.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DrawCardDTO): Promise<void> {
        const { client, times, calculatedValue } = payload;
        // TODO: Triger draw card attempted event

        for (let i = 1; i <= times; i++) {
            this.drawCard(client, calculatedValue);
        }
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

        const cards = draw.slice(draw.length - amount);

        const newHand = [...hand, ...cards];

        const newDraw = removeCardsFromPile({
            originalPile: draw,
            cardsToRemove: newHand,
        });

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: newHand,
            draw: newDraw,
        });

        const cardMoves = cards.map((card) => {
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
                    message_type: SWARMessageType.EnemyAttacked,
                    action: SWARAction.MoveCard,
                    data: cardMoves,
                }),
            ),
        );
    }
}
