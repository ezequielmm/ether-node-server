import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/expedition/expedition.service';

@Injectable()
export class GetEnergyAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<string> {
        const {
            data: {
                player: { energy, energy_max },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        return JSON.stringify({ energy, energy_max });
    }
}
