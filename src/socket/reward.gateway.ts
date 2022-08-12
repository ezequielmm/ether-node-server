import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IExpeditionNodeReward } from 'src/game/components/expedition/expedition.enum';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class RewardGateway {
    constructor(private readonly expeditionService: ExpeditionService) {}

    @SubscribeMessage('RewardSelected')
    async handleRewardSelected(
        client: Socket,
        rewardId: string,
    ): Promise<string> {
        // Get the updated expedition
        const {
            _id,
            currentNode: {
                completed: nodeIsCompleted,
                data: { rewards },
            },
            map,
        } = await this.expeditionService.findOne({
            clientId: client.id,
        });

        // Check if the node is completed
        if (nodeIsCompleted)
            throw new Error('Node already completed, cannot select reward');

        // check if the reward that we are receiving is correct and exists
        const reward = rewards.find(({ id }) => {
            return id === rewardId;
        });

        // If the reward is inavlid we throw and exception
        if (!reward) throw new Error(`Reward ${rewardId} not found`);

        // Now we set that we took the reward
        reward.taken = true;

        // Next we save the reward on the expedition
        await this.expeditionService.updateByFilter(
            {
                _id,
                'currentNode.data.rewards.id': rewardId,
            },
            {
                $set: {
                    'currentNode.data.rewards.$.taken': true,
                },
            },
        );

        // Now we apply the redward to the user profile
        switch (reward.type) {
            case IExpeditionNodeReward.Gold:
                await this.expeditionService.updateById(_id, {
                    $inc: {
                        'playerState.gold': reward.amount,
                    },
                });
                break;
        }

        // Now we get the rewards that are pending to be taken
        const pendingRewards = rewards.filter(({ id, taken }) => {
            return id !== rewardId && taken === false;
        });

        if (pendingRewards.length === 0) {
            return JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.ShowMap,
                    data: map,
                }),
            );
        } else {
            return JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.SelectAnotherReward,
                    data: pendingRewards,
                }),
            );
        }
    }
}
