import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { ClientId } from '../components/expedition/expedition.type';

interface DiscardAllCardsDTO {
    readonly clientId: ClientId;
}

@Injectable()
export class DiscardAllCardsAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardAllCardsDTO) {
        const { clientId } = payload;

        const {
            data: {
                player: {
                    cards: { hand, discard },
                },
            },
        } = await this.expeditionService.getCurrentNode({ clientId });

        const newDiscard = { ...hand, ...discard };

        await this.expeditionService.updateHandPiles({
            clientId,
            hand: [],
            discard: newDiscard,
        });
    }
}
