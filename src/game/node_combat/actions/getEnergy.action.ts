import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/expedition/expedition.service';

@Injectable()
export class GetEnergyAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<number[]> {
        const {
            data: {
                player: { energy, energy_max },
            },
        } = await this.expeditionService.getCurrentNodeByClientId(client.id);

        return [energy, energy_max];
    }
}
