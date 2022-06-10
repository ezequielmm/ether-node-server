import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/expedition/expedition.service';

interface UpdatePlayerEnergyDTO {
    readonly client_id: string;
    readonly energy: number;
}

@Injectable()
export class UpdatePlayerEnergyAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: UpdatePlayerEnergyDTO) {
        await this.expeditionService.updatePlayerEnergy(payload);
    }
}
