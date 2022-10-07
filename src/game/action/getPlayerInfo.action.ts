import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';

export interface PlayerInfoResponse {
    id: string;
    playerName: string;
    characterClass: string;
    hpCurrent: number;
    hpMax: number;
    gold: number;
    energy: number;
    energyMax: number;
    defense: number;
    cards: IExpeditionPlayerStateDeckCard[];
}

@Injectable()
export class GetPlayerInfoAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<PlayerInfoResponse> {
        const {
            playerState: { playerName, characterClass, gold, cards, playerId },
            currentNode: {
                data: {
                    player: { energy, energyMax, defense, hpCurrent, hpMax },
                },
            },
        } = await this.expeditionService.findOne({
            clientId,
        });

        return {
            id: playerId,
            playerName,
            characterClass,
            hpCurrent,
            hpMax,
            gold,
            energy,
            energyMax,
            defense,
            cards,
        };
    }
}
