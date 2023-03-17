import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { RewardService } from 'src/game/reward/reward.service';
import { corsSocketSettings } from './socket.enum';
import { ActionQueueService } from 'src/actionQueue/actionQueue.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway(corsSocketSettings)
export class RewardGateway {
    private readonly logger: Logger = new Logger(RewardGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly fullSyncAction: FullSyncAction,
        private readonly rewardService: RewardService,
        private readonly actionQueueService: ActionQueueService,
    ) {}

    @SubscribeMessage('RewardSelected')
    async handleRewardSelected(
        client: Socket,
        rewardId: string,
    ): Promise<string> {
        // await this.actionQueueService.push(
        //     await this.expeditionService.getExpeditionIdFromClient(
        //         client.id,
        //     ),
        //     async () => {
                this.logger.debug('<REWARD SELECTED>');
                
                // Get the game context
                const ctx = await this.expeditionService.getGameContext(client);

                const response = await this.rewardService.takeReward(ctx, rewardId);

                await this.fullSyncAction.handle(client, false);

                return response; // THIS PROBABLY BREAKS IN A CHAIN OF TYPE Promise<Void>. Rework to emit a response instead of returning.
                
        //         this.logger.debug('<REWARD SELECTED>');
        //     }
        // );
    }
}
