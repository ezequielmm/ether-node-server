import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { RewardService } from 'src/game/reward/reward.service';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class RewardGateway {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly fullSyncAction: FullSyncAction,
        private readonly rewardService: RewardService,
    ) {}

    @SubscribeMessage('RewardSelected')
    async handleRewardSelected(
        client: Socket,
        rewardId: string,
    ): Promise<string> {
        // Get the game context
        const ctx = await this.expeditionService.getGameContext(client);

        const response = await this.rewardService.takeReward(ctx, rewardId);

        await this.fullSyncAction.handle(client, false);

        return response;
    }
}
