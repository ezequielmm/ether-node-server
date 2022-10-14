import { createParamDecorator } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { corsSocketSettings } from 'src/socket/socket.enum';
import { ExpeditionService } from '../expedition/expedition.service';
import { PotionService } from './potion.service';

export const JsonPayload = createParamDecorator((data: string) => {
    return JSON.parse(data);
});

@WebSocketGateway(corsSocketSettings)
export class PotionGateway {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly potionService: PotionService,
    ) {}

    @SubscribeMessage('UsePotion')
    async use(client: Socket, payload: string): Promise<void> {
        const parsedPayload = JSON.parse(payload);

        const ctx = await this.expeditionService.getGameContext(client);

        await this.potionService.use(
            ctx,
            parsedPayload.potionId,
            parsedPayload.targetId,
        );
    }

    @SubscribeMessage('RemovePotion')
    async remove(client: Socket, potionId: string): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);
        await this.potionService.remove(ctx, potionId);
    }
}
