import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import {
    IExpeditionPlayerState,
    IExpeditionPlayerStateDeckCard,
} from '../components/expedition/expedition.interface';

export interface PlayerInfoResponse {
    id: string;
    playerId: number;
    playerName: string;
    characterClass: string;
    hpCurrent: number;
    hpMax: number;
    gold: number;
    energy: number;
    energyMax: number;
    defense: number;
    cards: IExpeditionPlayerStateDeckCard[];
    potions: IExpeditionPlayerState['potions'];
    trinkets: IExpeditionPlayerState['trinkets'];
}

@Injectable()
export class GetPlayerInfoAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<PlayerInfoResponse> {
        const expedition = await this.expeditionService.findOne({
            clientId,
        });

        if (!expedition)
            throw new CustomException(
                'No expedition found',
                ErrorBehavior.ReturnToMainMenu,
            );

        if (expedition.currentNode !== undefined) {
            const {
                playerId,
                playerState: {
                    playerName,
                    characterClass,
                    gold,
                    cards,
                    playerId: id,
                    potions,
                    trinkets,
                },
                currentNode,
            } = expedition;

            if (currentNode.data !== undefined) {
                const {
                    data: {
                        player: {
                            defense,
                            hpCurrent,
                            hpMax,
                            energy,
                            energyMax,
                        },
                    },
                } = currentNode;

                return this.returnResponse({
                    id,
                    playerId,
                    playerName,
                    characterClass,
                    hpCurrent,
                    hpMax,
                    gold,
                    energy,
                    energyMax,
                    defense,
                    cards,
                    potions,
                    trinkets,
                });
            } else {
                const {
                    playerState: { hpCurrent, hpMax },
                } = expedition;

                return this.returnResponse({
                    id,
                    playerId,
                    playerName,
                    characterClass,
                    hpCurrent,
                    hpMax,
                    gold,
                    energy: 0,
                    energyMax: 0,
                    defense: 0,
                    cards,
                    potions,
                    trinkets,
                });
            }
        } else {
            const {
                playerId,
                playerState: {
                    playerName,
                    characterClass,
                    gold,
                    cards,
                    playerId: id,
                    hpCurrent,
                    hpMax,
                    potions,
                    trinkets,
                },
            } = expedition;

            return this.returnResponse({
                id,
                playerId,
                playerName,
                characterClass,
                hpCurrent,
                hpMax,
                gold,
                energy: 0,
                energyMax: 0,
                defense: 0,
                cards,
                potions,
                trinkets,
            });
        }
    }

    private returnResponse = (
        payload: PlayerInfoResponse,
    ): PlayerInfoResponse => payload;
}
