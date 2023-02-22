import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { corsSocketSettings } from 'src/socket/socket.enum';
import { ExpeditionService } from '../expedition/expedition.service';
import { PotionService } from './potion.service';

interface UsePotionDTO {
    potionId: string;
    targetId: string;
}

@WebSocketGateway(corsSocketSettings)
export class PotionGateway {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly potionService: PotionService,
        private readonly fullSyncAction: FullSyncAction,
    ) {}

    @SubscribeMessage('UsePotion')
    async use(client: Socket, payload: string): Promise<void> {
        const { potionId, targetId } = JSON.parse(payload) as UsePotionDTO;

        const ctx = await this.expeditionService.getGameContext(client);

        await this.potionService.use(ctx, potionId, targetId);

        await this.fullSyncAction.handle(client, false);
    }

    @SubscribeMessage('RemovePotion')
    async remove(client: Socket, potionId: string): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);
        await this.potionService.remove(ctx, potionId);
        await this.fullSyncAction.handle(client, false);
    }
}
