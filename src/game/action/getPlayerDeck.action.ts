import { Injectable } from '@nestjs/common';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';

interface IGetPlayerDeck {
    id: string;
    name: string;
    description: string;
    rarity: CardRarityEnum;
    energy: number;
    cardType: CardTypeEnum;
    isUpgraded: boolean;
    pool: string;
}

@Injectable()
export class GetPlayerDeckAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<IGetPlayerDeck[]> {
        const {
            playerState: { cards },
        } = await this.expeditionService.findOne({
            clientId,
        });

        return cards.map((card) => ({
            id: card.id,
            name: card.name,
            description: card.description,
            rarity: card.rarity,
            energy: card.energy,
            cardType: card.cardType,
            isUpgraded: card.isUpgraded,
            pool: card.pool,
        }));
    }
}
