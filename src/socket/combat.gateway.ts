import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DataWSRequestTypesEnum } from './socket.enum';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { GetEnergyAction } from 'src/game/action/getEnergy.action';
import { GetCardPilesAction } from 'src/game/action/getCardPiles.action';
import { GetEnemiesAction } from 'src/game/action/getEnemies.action';
import { GetPlayerInfoAction } from 'src/game/action/getPlayerInfo.action';
import { CardId } from 'src/game/components/card/card.type';
import { TargetId } from 'src/game/effects/effects.types';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';
import { EndPlayerTurnProcess } from 'src/game/process/endPlayerTurn.process';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CombatTurnEnum } from 'src/game/components/expedition/expedition.enum';
import { EndEnemyTurnProcess } from 'src/game/process/endEnemyTurn.process';
import { SendEnemyIntentProcess } from 'src/game/process/sendEnemyIntents.process';
import { GetStatusesAction } from 'src/game/action/getStatuses.action';
import { GetPlayerDeckAction } from 'src/game/action/getPlayerDeck.action';
import { Context } from 'src/game/components/interfaces';
import { filter, find } from 'lodash';

interface CardPlayedInterface {
    cardId: CardId;
    targetId?: TargetId;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CombatGateway {
    private readonly logger: Logger = new Logger(CombatGateway.name);

    constructor(
        private readonly getEnergyAction: GetEnergyAction,
        private readonly getCardPilesAction: GetCardPilesAction,
        private readonly getEnemiesAction: GetEnemiesAction,
        private readonly getPlayerInfoAction: GetPlayerInfoAction,
        private readonly cardPlayedAction: CardPlayedAction,
        private readonly getStatusesAction: GetStatusesAction,
        private readonly endPlayerTurnProcess: EndPlayerTurnProcess,
        private readonly endEnemyTurnProcess: EndEnemyTurnProcess,
        private readonly expeditionService: ExpeditionService,
        private readonly sendEnemyIntentsProcess: SendEnemyIntentProcess,
        private readonly getPlayerDeckAction: GetPlayerDeckAction,
    ) {}

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<void> {
        this.logger.log(`Client ${client.id} trigger message "EndTurn"`);

        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const ctx: Context = {
            client,
            expedition,
        };

        const {
            currentNode: {
                data: { playing },
            },
        } = expedition;

        switch (playing) {
            case CombatTurnEnum.Player:
                await this.endPlayerTurnProcess.handle({ client });
                break;
            case CombatTurnEnum.Enemy:
                await this.endEnemyTurnProcess.handle({ ctx });
                break;
        }
    }

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<void> {
        this.logger.log(
            `Client ${client.id} trigger message "CardPlayed": ${payload}`,
        );

        const { cardId, targetId }: CardPlayedInterface = JSON.parse(payload);

        await this.cardPlayedAction.handle({ client, cardId, targetId });
    }

    @SubscribeMessage('GetData')
    async handleGetData(client: Socket, types: string): Promise<string> {
        this.logger.log(
            `Client ${client.id} trigger message "GetData": ${types}`,
        );

        try {
            let data = null;

            switch (types) {
                case DataWSRequestTypesEnum.Energy:
                    data = await this.getEnergyAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.CardsPiles:
                    data = await this.getCardPilesAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.Enemies:
                    data = await this.getEnemiesAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.Players:
                    data = await this.getPlayerInfoAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.Statuses:
                    data = await this.getStatusesAction.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.EnemyIntents:
                    data = await this.sendEnemyIntentsProcess.handle(client.id);
                    break;

                case DataWSRequestTypesEnum.PlayerDeck:
                    data = await this.getPlayerDeckAction.handle(client.id);
                    break;
            }

            return JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.GenericData,
                    action: types,
                    data,
                }),
            );
        } catch (e) {
            this.logger.error(e.message);
            client.emit('ErrorMessage', {
                message: `An Error has ocurred getting ${types}`,
            });
        }
    }

    @SubscribeMessage('RewardSelected')
    async handleRewardSelected(client: Socket, rewardId: string): Promise<any> {
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        if (expedition.currentNode.completed) {
            throw new Error('Node already completed, cannot select reward');
        }

        const reward = find(expedition.currentNode.data.rewards, {
            id: rewardId,
        });

        if (!reward) {
            throw new Error(`Reward ${rewardId} not found`);
        }

        reward.taken = true;

        await this.expeditionService.updateByFilter(
            {
                _id: expedition._id,
                'currentNode.data.rewards.id': rewardId,
            },
            {
                $set: {
                    'currentNode.data.rewards.$.taken': true,
                },
            },
        );

        if (reward.type === 'gold') {
            await this.expeditionService.updateById(expedition._id, {
                $inc: {
                    'playerState.gold': reward.amount,
                },
            });
        }

        const rewardsToTake = filter(expedition.currentNode.data.rewards, {
            taken: false,
        });

        if (rewardsToTake.length === 0) {
            return JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.ShowMap,
                    data: {
                        map: expedition.map,
                    },
                }),
            );
        }

        return JSON.stringify(
            StandardResponse.respond({
                message_type: SWARMessageType.EndTurn,
                action: SWARAction.SelectAnotherReward,
                data: filter(expedition.currentNode.data.rewards, {
                    taken: false,
                }),
            }),
        );
    }
}
