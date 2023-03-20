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
    ): Promise<void> {
        this.logger.debug('<REWARD SELECTED>');

        await this.actionQueueService.push(
            await this.expeditionService.getExpeditionIdFromClient(client.id),
            async () => {
                this.logger.debug('<REWARD SELECTED>');
                try {
                    const ctx = await this.expeditionService.getGameContext(
                        client,
                    );

                    await this.rewardService.takeReward(ctx, rewardId);

                    await this.fullSyncAction.handle(client, false);
                } catch (error) {
                    this.logger.error({
                        error,
                    });
                }
                this.logger.debug('</REWARD SELECTED>');
            },
        );
    }
}
