import { Injectable } from '@nestjs/common';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class GetUpgradableCardsAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<IExpeditionPlayerStateDeckCard[]> {
        const {
            playerState: { cards },
        } = await this.expeditionService.findOne({ clientId });

        return cards.filter(({ isUpgraded }) => {
            return !isUpgraded;
        });
    }
}
