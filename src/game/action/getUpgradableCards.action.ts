import { Injectable } from '@nestjs/common';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class GetUpgradableCardsAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<IExpeditionPlayerStateDeckCard[]> {
        // First we get the current card deck from the player
        const {
            playerState: { cards },
        } = await this.expeditionService.findOne({ clientId }, { map: 0 });

        // Then, we return only the cards that can be upgraded
        return cards.filter(({ isUpgraded }) => !isUpgraded);
    }
}
