import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

interface PlayerInfoResponse {
    player_name: string;
    character_class: string;
    hp_current: number;
    hp_max: number;
    gold: number;
    energy: number;
    energy_max: number;
    defense: number;
}

@Injectable()
export class GetPlayerInfoAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<PlayerInfoResponse> {
        const {
            player_state: {
                player_name,
                character_class,
                hp_current,
                hp_max,
                gold,
            },
            current_node: {
                data: {
                    player: { energy, energy_max, defense },
                },
            },
        } = await this.expeditionService.findOne({
            client_id: client.id,
        });

        return {
            player_name,
            character_class,
            hp_current,
            hp_max,
            gold,
            energy,
            energy_max,
            defense,
        };
    }
}
