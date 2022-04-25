import { Injectable } from '@nestjs/common';
import { ExpeditionPlayerStateDeckCardInterface } from '../interfaces/expeditionPlayerStateDeckCard.interface';

@Injectable()
export class SocketService {
    removeHandCardsFromDrawPile(
        drawCards: ExpeditionPlayerStateDeckCardInterface[],
        handCards: ExpeditionPlayerStateDeckCardInterface[],
    ): ExpeditionPlayerStateDeckCardInterface[] {
        return drawCards.filter((drawCard) => {
            return !handCards.some((handCard) => {
                return drawCard.id === handCard.id;
            });
        });
    }
}
