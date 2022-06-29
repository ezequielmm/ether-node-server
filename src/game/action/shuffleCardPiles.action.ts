import { Injectable } from '@nestjs/common';
import { CardService } from '../components/card/card.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { ClientId } from '../components/expedition/expedition.type';
import { SettingsService } from '../components/settings/settings.service';

interface DrawCardDTO {
    clientId: ClientId;
}

@Injectable()
export class ShuffleCardPilesAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly settingsService: SettingsService,
        private readonly cardService: CardService,
    ) {}

    async handle(payload: DrawCardDTO) {
        const { clientId } = payload;

        const {
            player: { handSize },
        } = await this.settingsService.getSettings();

        const {
            data: {
                player: {
                    cards: {
                        draw: originalDrawPile,
                        discard: originalDiscardPile,
                    },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        if (originalDrawPile.length < handSize) {
            const newDrawPile = [...originalDrawPile, ...originalDiscardPile];

            const newHandPile = newDrawPile
                .sort(() => 0.5 - Math.random())
                .slice(0, handSize);

            const newDrawCards = this.cardService.removeHandCardsFromDrawPile(
                newDrawPile,
                newHandPile,
            );
        }
    }
}
