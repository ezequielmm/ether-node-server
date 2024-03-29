import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { Player } from '../components/expedition/player';

export interface PlayerInfoResponse {
    id: string;
    userAddress: string;
    playerName: string;
    characterClass: string;
    hpCurrent: number;
    hpMax: number;
    gold: number;
    energy: number;
    energyMax: number;
    defense: number;
    cards: IExpeditionPlayerStateDeckCard[];
    potions: Player['potions'];
    trinkets: Player['trinkets'];
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

        if (typeof expedition.currentNode !== 'undefined') {
            const {
                userAddress,
                playerState: {
                    playerName,
                    characterClass,
                    gold,
                    cards,
                    userAddress: id,
                    potions,
                    trinkets,
                },
                currentNode,
            } = expedition;

            if (typeof currentNode.data !== 'undefined') {
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
                    userAddress,
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
                    userAddress,
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
                userAddress,
                playerState: {
                    playerName,
                    characterClass,
                    gold,
                    cards,
                    userAddress: id,
                    hpCurrent,
                    hpMax,
                    potions,
                    trinkets,
                },
            } = expedition;

            return this.returnResponse({
                id,
                userAddress,
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
