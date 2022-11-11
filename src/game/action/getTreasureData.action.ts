import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionService } from '../components/potion/potion.service';
import { TrinketService } from '../components/trinket/trinket.service';
import { ItemsTypeEnum } from '../merchant/merchant.enum';

@Injectable()
export class GetTreasureDataAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string) {
        const { nodeId } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        const {
            private_data: { treasure },
        } = await this.expeditionService.getExpeditionMapNode({
            clientId,
            nodeId,
        });

        return treasure.type;
    }
}
