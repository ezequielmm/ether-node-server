import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';

interface IGetDeck {
    id: string;
    name: string;
    description: string;
    rarity: CardRarityEnum;
    energy: number;
    cardType: CardTypeEnum;
    isUpgraded: boolean;
    pool: string;
    showPointer: boolean;
}

interface GetCardPilesResponse {
    hand: IGetDeck[];
    draw: IGetDeck[];
    discard: IGetDeck[];
    exhausted: IGetDeck[];
    energy: number;
    energyMax: number;
}

@Injectable()
export class GetCardPilesAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<GetCardPilesResponse> {
        const {
            data: {
                player: {
                    energy,
                    energyMax,
                    cards: { exhausted, draw, discard, hand },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        return {
            draw: this.formatCard(draw),
            discard: this.formatCard(discard),
            exhausted: this.formatCard(exhausted),
            hand: this.formatCard(hand),
            energy,
            energyMax,
        };
    }

    private formatCard(deck: IExpeditionPlayerStateDeckCard[]): IGetDeck[] {
        return deck.map((card) => ({
            id: card.id,
            name: card.name,
            description: card.description,
            rarity: card.rarity,
            energy: card.energy,
            cardType: card.cardType,
            isUpgraded: card.isUpgraded,
            pool: card.pool,
            showPointer: card.showPointer,
        }));
    }
}
